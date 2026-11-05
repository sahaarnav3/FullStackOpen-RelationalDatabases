const router = require("express").Router();
const { Blog, User } = require("../models");
const { blogFinder, tokenExtractor } = require("../util/middleware");

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId']},
    include: {
      model: User,
      attributes: ['name']
    }
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

router.delete("/:id", blogFinder, async (req, res) => {
  await req.blog.destroy();
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

module.exports = router;
