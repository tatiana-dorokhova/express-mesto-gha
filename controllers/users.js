const { Error } = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/badRequestError");
const ConflictError = require("../errors/conflictError");
const NotFoundError = require("../errors/notFoundError");

const { JWT_SALT } = require("../utils/constants");

const getUsers = (req, res, next) => {
  User.find({})
    .then((usersList) => {
      // если коллекция пользователей пустая, то вернуть ошибку 404
      if (usersList.length === 0) {
        throw new NotFoundError("Список пользователей пуст");
        // здесь не нужен return, т.к. после throw
        // контроль передается на первый доступный catch
      }
      res.send(usersList);
    })
    .catch(next);
};

const getUserMe = (req, res) => {
  const { _id } = req.user;

  req.params.userId = _id;
  getUserById(req, res);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      // если формат переданного userId верный,
      // но пользователь по нему не найден (равен null), вернуть ошибку 404
      if (!user) {
        throw new NotFoundError("Пользователь с указанным id не найден");
      }
      res.send(user);
    })
    .catch((err) => {
      // если формат userId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        next(new BadRequestError("ID пользователя передан в неверном формате"));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      // удаляем пароль из ответа
      const userObjectWithoutPassword = user.toObject();
      delete userObjectWithoutPassword.password;
      res.send(userObjectWithoutPassword);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestError(
            "Неверный формат данных при создании пользователя"
          )
        );
        return;
      }
      // если в базе есть пользователь с таким же email, выдать ошибку 409
      if (err.code === 11000) {
        next(
          new ConflictError("Пользователь с таким email уже заведен в системе")
        );
        return;
      }
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }
  )
    .then((user) => {
      // если пользователь с таким id не найден, то выдать ошибку 404
      if (!user) {
        throw new BadRequestError(
          "Ошибка при обновлении пользователя: пользователь с заданным id не найден"
        );
      }
      res.send(user);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestError(
            "Неверный формат данных при обновлении пользователя"
          )
        );
        return;
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }
  )
    .then((user) => {
      // если пользователь с таким id не найден, то выдать ошибку 404
      if (!user) {
        throw new BadRequestError(
          "Ошибка при обновлении аватара пользователя: пользователь с заданным id не найден"
        );
      }
      res.send(user);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestError(
            "Неверный формат данных при обновлении аватара пользователя"
          )
        );
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SALT, {
        expiresIn: "7d",
      });

      // вернём токен
      // можно вернуть его просто в ответе: res.send({ token });
      // можно вернуть как httpOnly-куку
      res
        .cookie("jwtToken", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: "Authorization successful" });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  getUserMe,
  updateUserProfile,
  updateUserAvatar,
  login,
};
