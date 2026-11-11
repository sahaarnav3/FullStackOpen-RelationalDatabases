const router = require("express").Router();
const { Blog, User } = require("../models");
const { blogFinder, tokenExtractor } = require("../util/middleware");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  let where = {};
  if (req.query.search)
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`, //made the search case insensitive. (Could also use Op.substring)
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [
      ['likes', 'DESC']
    ],
  });
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  return res.json(req.blog);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  loggedInUser = req.decodedToken.id;
  console.log(req.blog.dataValues);
  if (loggedInUser === req.blog.dataValues.id) await req.blog.destroy();
  else res.status(500).json({ error: "You dont have the permission." });
  res.status(204).end();
});

router.put("/:id", tokenExtractor, blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes || req.blog.likes;
  req.blog.year = req.body.year || req.blog.year;
  await req.blog.save();
  res.json(req.blog);
});

module.exports = router;
