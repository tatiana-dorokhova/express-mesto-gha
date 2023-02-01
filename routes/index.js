const { celebrate, Joi } = require('celebrate');
const router = require('express').Router(); // создали роутер
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { REGEX_URL_PATTERN } = require('../utils/constants');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(REGEX_URL_PATTERN),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

// в случае успеха добавляет в каждый запрос свойство req.user
// с записанным в него токеном
router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

// если обращение происходит к ресурсу, не описанному выше в роутах, то выдавать ошибку 404
router.all('*', (req, res, next) => next(new NotFoundError('Запрошена несуществующая страница')));

module.exports = router;
