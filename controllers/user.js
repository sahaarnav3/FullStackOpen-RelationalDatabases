const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");
const { tokenExtractor, isAdmin } = require("../util/middleware");

router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ["name", "username"],
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId"] },
        through: { attributes: [] },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", tokenExtractor, isAdmin, async (req, res) => {
  const userResponse = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (userResponse) {
    userResponse.name = req.body.name || userResponse.name;
    if (req.body.disabled !== null && req.body.disabled !== undefined) {
      if (req.isAdmin) userResponse.disabled = req.body.disabled;
      else return res.status(401).json({ error: "operation not allowed" });
    }
    await userResponse.save();
    res.json(userResponse);
  } else
    res.status(404).json({ error: "User with given username not present" });
});

module.exports = router;
