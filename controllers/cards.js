const { Error } = require("mongoose");
const Card = require("../models/card");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  INT_SERV_ERR_MESSAGE,
} = require("../utils/constants");

const getCards = (req, res) => {
  Card.find({})
    .then((cardList) => {
      // если коллекция карточек пустая, то вернуть ошибку 404
      // if (cardList.length === 0) {
      //   res.status(NOT_FOUND).send({ message: "Список карточек пуст" });
      //   return;
      // }
      res.send(cardList);
    })
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      })
    );
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      // если формат переданного cardId верный,
      // но карточка по нему не найдена (равна null), вернуть ошибку 404
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным id не найдена" });
        return;
      }
      console.log(card);
      res.send({ message: "Пост удалён" });
    })
    .catch((err) => {
      // если формат cardId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        res.status(BAD_REQUEST).send({
          message: "ID карточки передан в неверном формате: " + err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({
          message:
            "Неверный формат данных при создании карточки: " + err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });
};

const likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      // если формат переданного cardId верный,
      // но карточка по нему не найдена (равна null), вернуть ошибку 404
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным id не найдена" });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      // если формат cardId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        res.status(BAD_REQUEST).send({
          message: "ID карточки передан в неверном формате: " + err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      // если формат переданного cardId верный,
      // но карточка по нему не найдена (равна null), вернуть ошибку 404
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным id не найдена" });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      // если формат cardId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        res.status(BAD_REQUEST).send({
          message: "ID карточки передан в неверном формате: " + err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
