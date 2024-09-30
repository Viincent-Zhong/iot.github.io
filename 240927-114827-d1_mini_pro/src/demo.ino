#include <Arduino.h>
#include <string>

/* ESP8266 Dependencies */
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>  // Remplacer SPIFFS par LittleFS pour ESP8266
#include <ESP8266mDNS.h>  // Pour mDNS sur ESP8266

#include <ESPConnect.h>

AsyncWebServer server(80);

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
  String password = "MySecretPassword";     // Mot de passe pour le point d'accès Wi-Fi
  ESPConnect.autoConnect(customSSID.c_str(), password.c_str());  // Créer le Captive Portal avec SSID et mot de passe
 
  /* 
    Begin connecting to previous WiFi
    or start autoConnect AP if unable to connect
  */
  if (ESPConnect.begin(&server)) {
    Serial.println("Connecté au Wi-Fi");
    Serial.println("Adresse IP: " + WiFi.localIP().toString());

    // Initialisation de mDNS
    if (MDNS.begin("hugoboss")) {
      Serial.println("mDNS démarré avec succès. Accédez à esp8266.local");
    } else {
      Serial.println("Erreur lors de l'initialisation de mDNS");
    }
  } else {
    Serial.println("Échec de la connexion au Wi-Fi");
  }

  // Servir le fichier index.html depuis LittleFS (ou SPIFFS pour ESP32)
  // Servir le fichier index.html depuis LittleFS (ou SPIFFS pour ESP32)
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("C'est le code du Vince");
    request->send(LittleFS, "/index.html", "text/html");
  });

  server.begin();
  Serial.println("Serveur démarré");
}

void loop() {
  // Mise à jour de mDNS
  MDNS.update();
  int value = analogRead(A0);
  Serial.println(value);
  delay(500);
}
