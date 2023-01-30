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

router.get("/:userId", getUserById);

router.patch("/me", updateUserProfile); // обновляет профиль

router.patch("/me/avatar", updateUserAvatar); // обновляет аватар

module.exports = router;
