const { celebrate, Joi } = require('celebrate');
const router = require('express').Router(); // создали роутер
const { REGEX_URL_PATTERN } = require('../utils/constants');

const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteCardById,
); // удаляет карточку по идентификатору

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(REGEX_URL_PATTERN),
    }),
  }),
  createCard,
); // создаёт карточку

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  likeCard,
); // поставить лайк карточке

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  dislikeCard,
); // убрать лайк с карточки

module.exports = router;
