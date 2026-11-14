const express = require("express");
const app = express();
const { errorHandler } = require("./util/middleware");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const resetRouter = require("./controllers/reset");
const authorRouter = require("./controllers/author");
const readingListRouter = require("./controllers/readingLists");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/reset", resetRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", readingListRouter);

app.get("/", async(_req, res) => {
  return res.send(200);
})

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

start();
