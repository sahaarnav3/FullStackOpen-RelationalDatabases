const { Blog, User } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

const errorHandler = async (error, _req, res, next) => {
  // console.error("errrrr", error);

  // if(error.name === 'SequelizeValidationError'){
  //   return res.status(400).send({ error: error.message });
  // }

  if (error.name === "SequelizeValidationError")
    return res
      .status(400)
      .send({ error: "username must be a valid email address" });

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "SequelizeUniqueConstraintError")
    return res
      .status(400)
      .send({
        error: "Given username already exists, please try with new username.",
      });

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  // console.log("authoro", authorization)
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log("token error", error);
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  console.log("isadmin user", user.admin);
  if (user.admin)
    req.isAdmin = true;
  else req.isAdmin = false;
  next();
};

module.exports = { blogFinder, errorHandler, tokenExtractor, isAdmin };
