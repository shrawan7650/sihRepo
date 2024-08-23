const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/microcontrollerData")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Schema and Model Definition
const DataSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  pressure: { type: Number, required: true },
  altitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Data = mongoose.model("Data", DataSchema);

// Define a simple route
app.get("/", (req, res) => {
  res.send("API is running");
});

// API Route to receive data
app.post("/api/data", async (req, res) => {
  try {
    const { temperature, humidity, pressure, altitude } = req.body;

    const newData = new Data({
      temperature,
      humidity,
      pressure,
      altitude,
    });

    await newData.save();

    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
