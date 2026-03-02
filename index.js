const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI =
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("car-rental-db-demo");
    const carsCollection = database.collection("all-cars");
    // const bookingsCollection = database.collection("bookings");
    // const contactCollection = database.collection("contactInfo");

    // get all cars API
    app.get('/cars', async (req, res) => {
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // . get car details API
    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; 
      const result = await carsCollection.findOne(query);
      res.send(result);
    });

    // if need to new booking save fro buyer API
    // app.post('/bookings', async (req, res) => {
    //   const booking = req.body;
    //   const result = await bookingsCollection.insertOne(booking);
    //   res.send(result);
    // });

    // . save contact information for buyer API
    // app.post('/contact-info', async (req, res) => {
    //   const info = req.body;
    //   const result = await contactCollection.insertOne(info);
    //   res.send(result);
    // });

    console.log("Connected to MongoDB successfully!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Car Rental Server is Running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});