import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Data from "./models/data.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// POST endpoint จาก ESP32
app.post("/api/data", async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    const newData = new Data({ temperature, humidity });
    await newData.save();
    res.status(201).json({ message: "Data saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint ข้อมูลล่าสุด
app.get("/api/data/latest", async (req, res) => {
  try {
    const latest = await Data.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint ข้อมูลย้อนหลัง (ล่าสุด 50 record)
app.get("/api/data/history", async (req, res) => {
  try {
    const history = await Data.find().sort({ timestamp: -1 }).limit(50);
    res.json(history.reverse()); // เรียงจากเก่าสุดไปใหม่สุด
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
