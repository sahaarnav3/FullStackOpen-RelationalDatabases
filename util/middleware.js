const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

const errorHandler = async (error, _req, res, next) => {
//   console.error("errrrr", error.name);

  if(error.name === 'SequelizeValidationError'){
    return res.status(400).send({ error: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

module.exports = { blogFinder, errorHandler };
