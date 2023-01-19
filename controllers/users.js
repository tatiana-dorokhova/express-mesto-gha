const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка" + err.message })
    );
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) =>
      res
        .status(404)
        .send({ message: "Нет пользователя с таким id" + err.message })
    );
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка" + err.message })
    );
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
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({
        message: "Произошла ошибка при обновлении профиля" + err.message,
      })
    );
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
    .then((data) => res.send(data))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Произошла ошибка при смене аватара" + err.message })
    );
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
