const router = require("express").Router();

const { User, Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: []
    },
    attributes: [
        ['name', 'author'],
        [sequelize.fn('COUNT', sequelize.col('blogs.id')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('blogs.likes')), 'likes'],
    ],
    group: ['user.id'],
    raw: true,
  });
  res.json(users);
});

module.exports = router;