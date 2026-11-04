const router = require('express').Router()
const { Blog } = require("../models")

const blogFinder = async(req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  return res.json(req.blog);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Blog.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// router.put("/:id", blogFinder, async(req, res) => {

// })

module.exports = router