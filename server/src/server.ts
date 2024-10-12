require('dotenv').config()
import express from 'express';
import { connectToMongoDB } from './config/db';

connectToMongoDB();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});