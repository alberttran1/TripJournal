// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const verifyFirebaseToken = require("../middleware/authMiddleware");
const cloudinary = require("../utils/cloudinary.js");

// POST /api/trips - Create a new trip for the logged-in user
router.post("/", verifyFirebaseToken, async (req, res) => {
  const userId = req.user.uid;
  const { title, startDate, endDate, dateImages, dateDescriptions } = req.body;

  try {
    const trip = await Trip.create({
      userId,
      title,
      startDate,
      endDate,
      dateImages,
      dateDescriptions,
    });
    res.status(201).json(trip);
  } catch (err) {
    console.error("Create trip error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/trips - Get all trips for the current user
router.get("/", verifyFirebaseToken, async (req, res) => {
  const userId = req.user.uid;
  try {
    const trips = await Trip.find({ userId });
    res.json(trips);
  } catch (err) {
    console.error("Fetch trips error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/trips/:id - Get a single trip by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.json(trip);
  } catch (err) {
    console.error("Get trip error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/trips/:id - Update a trip by ID
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.json(trip);
  } catch (err) {
    console.error("Update trip error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Extract all Cloudinary public IDs from dateImages
    const imageUrls = [];

    trip.dateImages?.forEach((imageArray) => {
      imageArray.forEach((img) => {
        if (img.preview?.includes("res.cloudinary.com")) {
          imageUrls.push(img.preview);
        }
      });
    });

    const publicIds = imageUrls.map((url) => {
      const parts = url.split("/");
      const filename = parts.pop()?.split(".")[0]; // remove .jpg/.png
      return `${filename}`;
    });

    // Delete all images from Cloudinary
    function chunkArray(array, size) {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }
    
    const batches = chunkArray(publicIds, 100);
    
    for (const batch of batches) {
      try {
        const res = await cloudinary.api.delete_resources(batch);
        console.log("Batch deleted:", res);
      } catch (err) {
        console.error("Failed to delete batch:", err);
      }
    }
    
    // Now delete the trip document
    await Trip.deleteOne({ _id: id, userId });

    res.json({ message: "Trip and associated images deleted" });
  } catch (err) {
    console.error("Delete trip error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
