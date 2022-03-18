import * as express from 'express';
require('dotenv').config();

const app = express();
const port = 3000;
const API_URL = ``;
const API_KEY = process.env.API_KEY;

app.get('/', async (req, res) => {
  res.send({ message: 'Welcome to my app!' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
