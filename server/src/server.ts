import express from 'express';
import { connectToMongo } from './config/db';

// Load env locally
if (process.env.prod !== 'production')
  require('dotenv').config();

connectToMongo();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});