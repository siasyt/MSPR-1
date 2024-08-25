const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const animalUploadsRouter = require('./uploads/animalUploads');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://tangshiyun66:Tsy511502@mspr1.yklm0qf.mongodb.net/";
const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to database');
    const database = client.db('MSPR');
    const collection = database.collection('Animal_Info');
    
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    
    app.use('/animal/uploads', animalUploadsRouter(database));

    app.get('/animal/history', async (req, res) => {
      try {
        const historyData = await database.collection('Animal_Image').find().toArray();
        res.status(200).json(historyData);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/animals/species/:species', async (req, res) => {
      try {
        const animal = await collection.findOne({ Espèce: req.params.species });
        if (animal) {
          res.status(200).json(animal);
        } else {
          res.status(404).send('Animal not found');
        }
      } catch (error) {
        console.error('Error fetching animal:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

startServer();







