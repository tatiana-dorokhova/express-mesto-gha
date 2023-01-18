const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    // имя карточки
    name: {
      type: String, // строка
      required: true, // обязательное поле
      minlength: 2, // минимальная длина — 2 символа
      maxlength: 30, // максимальная — 30 символов
    },
    // ссылка на картинку
    link: {
      type: String,
      required: true,
    },
    // ссылка на модель автора карточки
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // список лайкнувших пост пользователей
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      ],
      default: [],
    },
    // дата создания
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false } // не создавать поле версии __v в БД
);

module.exports = mongoose.model("card", cardSchema);
