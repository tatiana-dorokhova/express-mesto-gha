const { celebrate, Joi } = require("celebrate");
const { REGEX_URL_PATTERN } = require("../utils/constants");
const router = require("express").Router(); // создали роутер
const {
  getUsers,
  getUserById,
  getUserMe,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
// этот роут должен идти раньше, чем следующий, чтобы /me не посчиталось за /:userId
router.get("/me", getUserMe);

router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUserById
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserProfile
); // обновляет профиль

router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(REGEX_URL_PATTERN),
    }),
  }),
  updateUserAvatar
); // обновляет аватар

module.exports = router;
