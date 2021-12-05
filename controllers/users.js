const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require("../errors/not-found-err");

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));

const getUser = (req, res, next) =>
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);

const createUser = (req, res, next) => {
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
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user_id,
    { name, about },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user_id,
    { avatar },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const login = (req, res, next) => {
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
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
