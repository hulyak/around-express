const fsPromises = require("fs").promises;
const path = require("path");
const usersRouter = require("express").Router();

const filePath = path.join(__dirname, "../data/users.json");

usersRouter.get("/", (req, res) => {
  fsPromises
    .readFile(filePath, "utf-8")
    .then((data) => res.send({ data: JSON.parse(data) }))
    .catch(() => res.status(500).send({ message: "An error has occurred" }));
});

usersRouter.get("/:id", (req, res) => {
  fsPromises.readFile(filePath, "utf-8").then((users) => {
    const user = JSON.parse(users).find((user) => user._id === req.params.id);
    if (!user) {
      res.status(400).send({ message: "User ID not found" });
    } else {
      res.send({ data: user });
    }
  });
});

module.exports = usersRouter;
