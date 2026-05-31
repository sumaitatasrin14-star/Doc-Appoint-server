const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI;

// Mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("doctorDB");

    const doctorsCollection = db.collection("doctors");
    const appointmentsCollection = db.collection("appointments");

    console.log("✅ MongoDB connected successfully");

    // ======================
    // GET ALL DOCTORS
    // ======================
    app.get("/doctors", async (req, res) => {
      const result = await doctorsCollection.find().toArray();
      res.send(result);
    });

    // ======================
    // GET ALL APPOINTMENTS
    // ======================
    app.get("/appointments", async (req, res) => {
      const result = await appointmentsCollection.find().toArray();
      res.send(result);
    });

    // ======================
    // POST APPOINTMENT
    // ======================
    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentsCollection.insertOne(appointment);
      res.send(result);
    });

  } catch (error) {
    console.error("MongoDB error:", error);
  }
}

run();

// Home route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});