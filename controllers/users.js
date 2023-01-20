const { Error } = require("mongoose");
const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((usersList) => {
      // если коллекция пользователей пустая, то вернуть ошибку 404
      if (usersList.length === 0) {
        res.status(404).send({ message: "Список пользователей пуст" });
        return;
      }
      res.send(usersList);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Произошла ошибка при запросе списка пользователей: " + err.message,
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
          .status(404)
          .send({ message: "Пользователь с указанным id не найден" });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      // если формат userId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        res.status(400).send({
          message: "ID пользователя передан в неверном формате: " + err.message,
        });
        return;
      }
      res.status(500).send({
        message: "Ошибка при запросе данных пользователя: " + err.message,
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
        res.status(400).send({
          message:
            "Неверный формат данных при создании пользователя: " + err.message,
        });
        return;
      }
      res.status(500).send({
        message: "Произошла ошибка при создании пользователя: " + err.message,
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
        res.status(400).send({
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
        res.status(400).send({
          message:
            "Неверный формат данных при обновлении пользователя: " +
            err.message,
        });
        return;
      }
      res.status(500).send({
        message: "Произошла ошибка при обновлении профиля: " + err.message,
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
        res.status(400).send({
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
        res.status(400).send({
          message:
            "Неверный формат данных при обновлении аватара пользователя: " +
            err.message,
        });
        return;
      }
      res.status(500).send({
        message: "Произошла ошибка при обновлении аватара: " + err.message,
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
