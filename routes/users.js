const router = require("express").Router(); // создали роутер
const {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.post("/", createUser);

router.patch("/me", updateUserProfile); // обновляет профиль

router.patch("/me/avatar", updateUserAvatar); // обновляет аватар

module.exports = router;
