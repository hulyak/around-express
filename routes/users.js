const usersRouter = require("express").Router();
const {
  createUser,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
} = require("../controllers/users");

usersRouter.get("/:id", getUser);
usersRouter.get("/", getUsers);
usersRouter.patch("/me", updateProfile);
usersRouter.patch("/me/avatar", updateAvatar);
usersRouter.post("/signup", createUser);
usersRouter.post("/signin", login);

module.exports = usersRouter;
