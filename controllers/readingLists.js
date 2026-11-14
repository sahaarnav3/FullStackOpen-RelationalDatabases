const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models/index");
// const { tokenExtractor } = require('../util/middleware');

router.post("/", async (req, res) => {
  try {
    const { userId, blogId } = req.body;
    const blogDetails = await Blog.findByPk(blogId);
    const userDetails = await User.findByPk(userId);
    if (!blogDetails)
      return res
        .status(404)
        .json({ error: "Blog with given ID doesn't exist" });
    if (!userDetails)
      return res
        .status(404)
        .json({ error: "User with given ID doesn't exist" });

    const existing = await ReadingList.findOne({ where: { userId, blogId } });
    if (existing) {
      return res
        .status(409)
        .json({ error: "this blog is already on the reading list" });
    }

    const readingList = await ReadingList.create({ ...req.body, read: false });
    res.json(readingList);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
