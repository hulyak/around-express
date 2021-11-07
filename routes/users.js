const usersRouter = require('express').Router();
const {
  createUser, getUser, getUsers, updateProfile, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/:id', getUser);
usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
