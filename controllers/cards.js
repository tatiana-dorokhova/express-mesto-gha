const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка: " + err.message })
    );
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => res.send(data))
    .catch((err) =>
      res
        .status(404)
        .send({ message: "Нет карточки с таким id " + err.message })
    );
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка: " + err.message })
    );
};

const likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка" + err.message })
    );

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка" + err.message })
    );

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
