require('dotenv').config();
const express = require('express');
const cors = require('cors');
const faker = require('faker');
const { generateUserData } = require('./userDataGenerator');
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// API to get user data
app.get('/api/users', (req, res) => {
  const { region = 'USA', errors = 0, seed = 1, page = 1 } = req.query;
  const data = generateUserData(region, Number(errors), Number(seed), Number(page));
  res.json(data);
});

// API to generate random seed
app.get('/api/generate-seed', (req, res) => {
  const seed = faker.datatype.number({ min: 1, max: 1000000 });
  res.json({ seed });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});