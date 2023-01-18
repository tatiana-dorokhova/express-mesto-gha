const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка" + err.message })
    );
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(404).send({ message: "Нет карточки с таким id" + err.message })
    );
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.send(card))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка" + err.message })
    );
};

const likeCard = (req, res) => {};

const unlikeCard = (req, res) => {};

module.exports = { getCards, createCard, deleteCardById, likeCard, unlikeCard };
