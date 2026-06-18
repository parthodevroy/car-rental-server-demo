const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
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
    
    await client.connect();

    const database = client.db("hair-store");
    const servicesCollection = database.collection("services");

    console.log("Successfully Connected MongDB!");

    app.get('/service', async (req, res) => {
      try {
        const cursor = servicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "problem to get data ", error: error.message });
      }
    });

    app.get('/service/:id', async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            message: "Invalid ID"
          });
        }

        const result = await servicesCollection.findOne({
          _id: new ObjectId(id)
        });

        if (!result) {
          return res.status(404).send({
            message: "Service not found"
          });
        }

        res.send(result);

      } catch (error) {
        res.status(500).send({
          message: error.message
        });
      }
    });

  } catch (error) {
    console.error("database connection problem:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Diamond Style Braids Server Is Running...');
});

app.listen(port, () => {
  console.log(`this server is running : ${port}`);
});