#include <Arduino.h>
#include <string>

/* ESP8266 Dependencies */
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

#include <LittleFS.h>  // Remplacer SPIFFS par LittleFS pour ESP8266
#include <ESP8266mDNS.h>  // Pour mDNS sur ESP8266
#include <ESPConnect.h>
/* Broker */
#include <PubSubClient.h>
#include <CertStoreBearSSL.h>
#include <TZ.h>
#include <ArduinoJson.h>

const char *mqtt_broker = "775360ff0b4a48688c72fb94bcfa50e6.s1.eu.hivemq.cloud";  // EMQX broker endpoint
const char *mqtt_username = "admin";  // MQTT username for authentication
const char *mqtt_password = "admin";  // MQTT password for authentication
const int mqtt_port = 8883;  // MQTT port (TCP)
String alert_topic;  // MQTT topic

AsyncWebServer server(80);
PubSubClient * mqtt_client;
BearSSL::CertStore certStore;
unsigned long lastMsg = 0;

void sendData()
{
  unsigned long now = millis();
  if (now - lastMsg > 10000) {
    lastMsg = now;
    StaticJsonDocument<200> JSONData;
    JSONData["device"] = ESP.getChipId();
    JSONData["value"] = analogRead(A0);
    char jsonBuffer[100];
    serializeJson(JSONData, jsonBuffer);
    mqtt_client->publish("data", jsonBuffer);
  }
}

void registerDevice()
{
  StaticJsonDocument<200> JSONData;
  JSONData["device"] = ESP.getChipId();
  char jsonBuffer[100];
  serializeJson(JSONData, jsonBuffer);
  mqtt_client->publish("register-device", jsonBuffer);
}

void mqttCallback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message received on topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    for (unsigned int i = 0; i < length; i++) {
        Serial.print((char) payload[i]);
    }
    Serial.println();
    Serial.println("-----------------------");

    // Alert topic
    if (strcmp(topic, alert_topic.c_str()) == 0) {
      if ((char)payload[0] == '1') {
        digitalWrite(D4, LOW); // LED On
      } else if ((char)payload[0] == '0') {
        digitalWrite(D4, HIGH); // LED Off
      }
  }
}

void connectToBroker() {
  while (!mqtt_client->connected()) {
    String client_id = "esp8266-client-" + String(WiFi.macAddress());
    Serial.printf("Connecting to MQTT Broker as %s..... using %s %s\n", client_id.c_str(), mqtt_username, mqtt_password);

    if (mqtt_client->connect(client_id.c_str(), mqtt_username, mqtt_password)) {
        Serial.println("Connected to MQTT broker");
        alert_topic = String("alert/" + String(ESP.getChipId()));
        mqtt_client->subscribe(alert_topic.c_str());
        registerDevice();
    } else {
        Serial.print("Failed to connect to MQTT broker, rc=");
        Serial.print(mqtt_client->state());
        Serial.println(" try again in 5 seconds");
        delay(5000);
    }
  }
}

void setDateTime() {
  // You can use your own timezone, but the exact time is not used at all.
  // Only the date is needed for validating the certificates.
  configTime(TZ_Europe_Berlin, "pool.ntp.org", "time.nist.gov");

  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(100);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println();

  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.printf("%s %s", tzname[0], asctime(&timeinfo));
}

void setup() {
  Serial.begin(115200);
  while (!Serial) { }  // Attendre l'ouverture du port série
  Serial.println("\nDémarrage de l'ESP8266/ESP32");

  // Initialiser LittleFS
  Serial.println("Initialisation de LittleFS...");
  if (!LittleFS.begin()) {
    Serial.println("Erreur lors de l'initialisation de LittleFS");
    return;
  }
  Serial.println("LittleFS initialisé avec succès");

  /*
    AutoConnect AP
    Configure SSID and password for Captive Portal
    Le réseau AP aura le nom MyCustomESPConfig et sera protégé par le mot de passe "MySecretPassword".
  */
  String customSSID = "VinceESPConfig";  // SSID personnalisé pour le point d'accès Wi-Fi
  String password = "password";     // Mot de passe pour le point d'accès Wi-Fi
  ESPConnect.autoConnect(customSSID.c_str(), password.c_str());  // Créer le Captive Portal avec SSID et mot de passe
  /* 
    Begin connecting to previous WiFi
    or start autoConnect AP if unable to connect
  */
  if (ESPConnect.begin(&server)) {
    Serial.println("Connecté au Wi-Fi");
    Serial.println("Adresse IP: " + WiFi.localIP().toString());

    // Initialisation de mDNS
    if (MDNS.begin("iot")) {
      Serial.println("mDNS démarré avec succès. Accédez à iot.local");
    } else {
      Serial.println("Erreur lors de l'initialisation de mDNS");
    }
  } else {
    Serial.println("Échec de la connexion au Wi-Fi");
  }

  // Servir le fichier index.html depuis LittleFS (ou SPIFFS pour ESP32)
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->redirect("/index.html?chipID=" + String(ESP.getChipId()));
  });

  server.on("/index.html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/index.html", "text/html");
  });

  setDateTime();
  /* Setup SSL certificate */
  int numCerts = certStore.initCertStore(LittleFS, PSTR("/certs.idx"), PSTR("/certs.ar"));
  Serial.printf("Number of CA certs read: %d\n", numCerts);
  if (numCerts == 0) {
    Serial.printf("No certs found. Did you run certs-from-mozilla.py and upload the LittleFS directory before running?\n");
    return; // Can't connect to anything w/o certs!
  }

  BearSSL::WiFiClientSecure *bear = new BearSSL::WiFiClientSecure();
  // Integrate the cert store with this connection
  bear->setCertStore(&certStore);

  mqtt_client = new PubSubClient(*bear);

  pinMode(D4, OUTPUT);
  server.begin();
  Serial.println("Serveur démarré");

  // Setup broker
  mqtt_client->setServer(mqtt_broker, mqtt_port);
  mqtt_client->setCallback(mqttCallback);
  connectToBroker();
}

void loop() {
  // Mise à jour de mDNS
  MDNS.update();
  mqtt_client->loop();
  sendData();
}
