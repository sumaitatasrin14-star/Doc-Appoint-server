const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI;

// Mongo Client
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

    console.log("✅ MongoDB Connected Successfully");

    const db = client.db("doctorDB");

    const doctorsCollection = db.collection("doctors");
    const appointmentsCollection = db.collection("appointments");

    // ==========================
    // GET ALL DOCTORS
    // ==========================
    app.get("/doctors", async (req, res) => {
      const result = await doctorsCollection.find().toArray();
      res.send(result);
    });

    // ==========================
    // GET ALL APPOINTMENTS
    // ==========================
    app.get("/appointments", async (req, res) => {
      const result = await appointmentsCollection.find().toArray();
      res.send(result);
    });

    // ==========================
    // POST APPOINTMENT
    // ==========================
    app.post("/appointments", async (req, res) => {
      try {
        const appointment = req.body;

        console.log("📥 Received Appointment:");
        console.log(appointment);

        const result = await appointmentsCollection.insertOne(
          appointment
        );

        console.log("✅ Appointment Saved");

        res.send({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error(error);

        res.status(500).send({
          success: false,
          message: "Failed to save appointment",
        });
      }
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

run();

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Doctor Appointment Server Running");
});

// Server Start
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});