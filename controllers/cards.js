const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .populate('user')
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

const createCard = (req, res) => {
  const { name, link } = req.body;

  // eslint-disable-next-line no-console
  console.log(req.user._id);

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`, errors: err.errors });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'No card found with that id') {
        res.status(404).send({ message: 'No card found with that id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user_id } }, { new: true })
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`, errors: err.errors });
      } if (err.message === 'No card found with that id') {
        return res.status(404).send({ message: 'No card found with that id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = 404;
      throw error;
    })

    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`, errors: err.errors });
      } if (err.message === 'No card found with that id') {
        return res.status(404).send({ message: 'No card found with that id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  deleteLikeCard,
};
