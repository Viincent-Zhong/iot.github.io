import express from 'express';
import router from './routes/routes';
import { connectToMongo } from './config/db';
import "./server-mqtt"

var cors = require('cors')
var cookieParser = require('cookie-parser')

// Load env locally
if (process.env.prod !== 'production')
  require('dotenv').config();

//connectToMongo();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/', router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});