const express = require("express");
const app = express();
const { errorHandler } = require("./util/middleware");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const { syncModels } = require("./models/index");

const blogsRouter = require("./controllers/blogs");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter)

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  await syncModels();
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

start();
