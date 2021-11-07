const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .populate('user')
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, user: req.user_id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`, errors: err.errors });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.body;

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user_id } }, { new: true })
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return card.like(userId);
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.body;

  return Card.findByIdAndRemove(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return card.deleteLike(userId);
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  deleteLikeCard,
};
