import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Data", dataSchema);
