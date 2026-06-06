const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../utils/supabase");

// GET /api/analytics
router.get("/analytics", async (req, res) => {
  try {
    const data = await getAnalytics();
    res.json(data);
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

module.exports = router;
