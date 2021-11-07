const express = require('express');
const mongoose = require('mongoose');

const app = express();
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(helmet());

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '618715e3d5bbc8fd98dc7911',
  };
  next();
});

// global error handling
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
