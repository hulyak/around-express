const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch((err) => res.status(500).send({ message: err.message }));

const getUser = (req, res) => User.findById(req.user_id)
  .orFail(() => {
    const error = new Error('User not found');
    error.status = 404;
    throw new Error('User not found');
  })
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send({ data: user });
  })
  .catch((err) => res.status(500).send({ message: err.message }));

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`, errors: err.errors });
      }
      return res.status(500).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user_id, { name, about },
    { new: true, runValidators: true, upsert: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user_id, { avatar },
    { new: true, runValidators: true, upsert: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
