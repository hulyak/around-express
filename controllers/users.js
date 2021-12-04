const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));

const getUser = (req, res) =>
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error("User not found");
      error.status = 404;
      throw new Error("User not found");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(404).send({ message: "User not found" });
      }
      res.status(500).send({ message: err.message });
    });

const createUser = (req, res) => {
  const { name, about, avatar, email, password, verifyPassword } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
        verifyPassword,
      })
    )
    .then((user) =>
      res.status(201).send({ name: user.name, email: user.email })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
          errors: err.errors,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user_id,
    { name, about },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.status = 404;
      throw new Error("User not found");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(404).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
          errors: err.errors,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user_id,
    { avatar },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.status = 404;
      throw new Error("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(404).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
          errors: err.errors,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .then((user) => {
      // if the password is correct, we create a token
      const token = jwt.sign(
        { _id: user.id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: 3600,
        }
      );
      res.send({ token });
    })
    .catch((err) => {
      // authentication error
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
