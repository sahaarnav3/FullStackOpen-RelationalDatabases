const router = require("express").Router();
const { Blog } = require("../models");
const { blogFinder } = require("../util/middleware");

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  return res.json(req.blog);
});

router.post("/", async (req, res) => {
  const blog = await Blog.create({ ...req.body });
  res.json(blog);
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
