const { Error } = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const { CREATED_STATUS } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cardList) => {
      res.send(cardList);
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  // сначала найти карточку в базе и сравнить id пользователя с текущим
  Card.findById(req.params.cardId)
    .then((card) => {
      // если карточка не найдена, то вернуть ошибку 404
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      // если владелец карточки не равен текущему пользователю, выдать ошибку 403
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои карточки');
      }
      // если владелец карточки равен текущему пользователю,
      // удалить карточку методом remove документа, пришедшего из БД
      return card.remove();
    })
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      // если формат cardId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        next(new BadRequestError('ID карточки передан в неверном формате'));
        return;
      }
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_STATUS).send(card))
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestError('Неверный формат данных при создании карточки'),
        );
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    // если формат переданного cardId верный,
    // но карточка по нему не найдена (равна null), вернуть ошибку 404
    if (!card) {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    // если формат cardId передан неверно, то выдать ошибку 400
    if (err instanceof Error.CastError) {
      next(new BadRequestError('ID карточки передан в неверном формате'));
      return;
    }
    next(err);
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    // если формат переданного cardId верный,
    // но карточка по нему не найдена (равна null), вернуть ошибку 404
    if (!card) {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    // если формат cardId передан неверно, то выдать ошибку 400
    if (err instanceof Error.CastError) {
      next(new BadRequestError('ID карточки передан в неверном формате'));
      return;
    }
    next(err);
  });

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
