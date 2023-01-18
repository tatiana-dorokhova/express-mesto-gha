const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // имя пользователя
    name: {
      type: String, // строка
      required: true, // обязательное поле
      minlength: 2, // минимальная длина — 2 символа
      maxlength: 30, // максимальная — 30 символов
    },
    // информация о пользователе
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    // ссылка на аватарку
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
