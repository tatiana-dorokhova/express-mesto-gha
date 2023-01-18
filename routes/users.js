const router = require("express").Router(); // создали роутер
const {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/:userId", getUserById);

router.post("/users", createUser);

router.patch("/users/me", updateUserProfile); // обновляет профиль

router.patch("/users/me/avatar", updateUserAvatar); // обновляет аватар

module.exports = router;
