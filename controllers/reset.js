const router = require("express").Router();
const { sequelize } = require("../util/db");
// const { tokenExtractor } = require("../util/middleware");

router.post("/", async (_req, res) => { //removed the middleware
  try {
    if (!process.env.TESTING)
      return res
        .status(500)
        .json({ error: "This route will only work for TESTING environment." });
    await sequelize.sync({ force: true });
    return res
      .status(200)
      .json({ error: "Database completely emptied and recreated!" });
  } catch (error) {
    console.error("Error resetting database:", error);
    return res.status(500).json({ error: "Error resetting database" });
  }
});

module.exports = router;
