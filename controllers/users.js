const { Error } = require("mongoose");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  INT_SERV_ERR_MESSAGE,
} = require("../utils/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((usersList) => {
      // если коллекция пользователей пустая, то вернуть ошибку 404
      if (usersList.length === 0) {
        res.status(NOT_FOUND).send({ message: "Список пользователей пуст" });
        return;
      }
      res.send(usersList);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      // если формат переданного userId верный,
      // но пользователь по нему не найден (равен null), вернуть ошибку 404
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным id не найден" });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      // если формат userId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        res.status(BAD_REQUEST).send({
          message: "ID пользователя передан в неверном формате: " + err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({
          message:
            "Неверный формат данных при создании пользователя: " + err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });
};

const updateUserProfile = (req, res) => {
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
        res.status(BAD_REQUEST).send({
          message:
            "Ошибка при обновлении пользователя: пользователь с заданным id не найден",
        });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({
          message:
            "Неверный формат данных при обновлении пользователя: " +
            err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });
};

const updateUserAvatar = (req, res) => {
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
        res.status(BAD_REQUEST).send({
          message:
            "Ошибка при обновлении аватара пользователя: пользователь с заданным id не найден",
        });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        res.status(BAD_REQUEST).send({
          message:
            "Неверный формат данных при обновлении аватара пользователя: " +
            err.message,
        });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: INT_SERV_ERR_MESSAGE,
      });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
