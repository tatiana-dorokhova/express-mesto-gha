const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    // имя пользователя
    name: {
      type: String, // строка
      minlength: 2, // минимальная длина — 2 символа
      maxlength: 30, // максимальная — 30 символов
      default: "Жак-Ив Кусто", // значение по умолчанию
    },
    // информация о пользователе
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Исследователь",
    },
    // ссылка на аватарку
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    // уникальный email пользователя
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        // опишем свойство validate
        // validator - функция проверки данных, value - значение свойства email
        validator(value) {
          return isEmail(value); // если строка не соответствует шаблону, вернётся false
        },
        message: "Поле email введено в неправильном формате", // когда validator вернёт false, будет использовано это сообщение
      },
    },
    // пароль к учетке пользователя
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { versionKey: false }
);

// собственный mongoose-метод, проверяющий почту и пароль
// функция не стрелочная, чтобы использовать this
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error("Неправильные почта или пароль"));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return user; // user будет использоваться в контроллере login
    });
  });
};

module.exports = mongoose.model("user", userSchema);
