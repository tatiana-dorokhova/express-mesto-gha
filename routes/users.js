const { celebrate, Joi } = require('celebrate');
const router = require('express').Router(); // создали роутер
const { REGEX_URL_PATTERN } = require('../utils/constants');
const {
  getUsers,
  getUserById,
  getUserMe,
  updateUserData,
} = require('../controllers/users');

router.get('/', getUsers);
// этот роут должен идти раньше, чем следующий, чтобы /me не посчиталось за /:userId
router.get('/me', getUserMe);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().length(24),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserData, // обновляет профиль
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(REGEX_URL_PATTERN),
    }),
  }),
  updateUserData, // обновляет аватар
);

module.exports = router;
