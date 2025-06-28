const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// Default route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
