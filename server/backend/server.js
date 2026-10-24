require("dotenv").config();

const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const audioRoutes = require("./audioRoutes");

const noteRoutes = require("./routes/noteRoutes");

const folderRoutes = require("./routes/folderRoutes");

const mongoose = require("mongoose");

const app = express();




app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/notes", noteRoutes);

app.use("/api/audio", audioRoutes);

app.use("/api/folders", folderRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Smart Voice Manager Backend is running!");
});

// MongoDB connection
console.log("MONGO_URI starts with:", process.env.MONGO_URI?.substring(0, 20));
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  }); 

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});