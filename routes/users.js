const userRouter = require("express").Router();
const users = require("../data/users.json");

userRouter.get("/", (req, res) => {
  res.send(users);
});

userRouter.get("/:id", (req, res) => {
  if (!users[req.params.id]) {
    res.status(400).send({ message: "User ID not found" });
    return;
  }

  const { id } = req.params;
  res.send(users[id]);
});

module.exports = userRouter;
