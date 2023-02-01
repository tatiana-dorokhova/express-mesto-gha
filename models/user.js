const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const UnauthorizedError = require('../errors/unauthorizedError');
const { validateUrl } = require('../utils/validateUrl');

const userSchema = new mongoose.Schema(
  {
    // имя пользователя
    name: {
      type: String, // строка
      minlength: 2, // минимальная длина — 2 символа
      maxlength: 30, // максимальная — 30 символов
      default: 'Жак-Ив Кусто', // значение по умолчанию
    },
    // информация о пользователе
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    // ссылка на аватарку
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: validateUrl,
        message: (props) => `${props.value} - ссылка имеет неправильный формат`,
      },
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
        message: 'Поле email введено в неправильном формате', // когда validator вернёт false, будет использовано это сообщение
      },
    },
    // пароль к учетке пользователя
    password: {
      type: String,
      required: true,
      select: false, // при этом флаге при селекте из БД не будет возвращаться это поле
    },
  },
  { versionKey: false },
);

// собственный mongoose-метод, проверяющий почту и пароль
// функция не стрелочная, чтобы использовать this
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password') // в этом случае при селекте из БД хэш пароля должен возвращаться
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }

      return bcrypt.compare(password, user.password).then((isHashMatched) => {
        if (!isHashMatched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }

        return user; // user будет использоваться в контроллерах users
      });
    });
};

module.exports = mongoose.model('user', userSchema);
