const { Error } = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');

const { CREATED_STATUS, JWT_SALT } = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((usersList) => {
      res.send(usersList);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      // если формат переданного userId верный,
      // но пользователь по нему не найден (равен null), вернуть ошибку 404
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      // если формат userId передан неверно, то выдать ошибку 400
      if (err instanceof Error.CastError) {
        next(new BadRequestError('ID пользователя передан в неверном формате'));
        return;
      }
      next(err);
    });
};

const getUserMe = (req, res) => {
  const { _id } = req.user;

  req.params.userId = _id;
  getUserById(req, res);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      // удаляем пароль из ответа
      const userObjectWithoutPassword = user.toObject();
      delete userObjectWithoutPassword.password;
      res.status(CREATED_STATUS).send(userObjectWithoutPassword);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestError(
            'Неверный формат данных при создании пользователя',
          ),
        );
        return;
      }
      // если в базе есть пользователь с таким же email, выдать ошибку 409
      if (err.code === 11000) {
        next(
          new ConflictError('Пользователь с таким email уже заведен в системе'),
        );
        return;
      }
      next(err);
    });
};

const updateUserData = (req, res, next) => {
  // валидации на полях name, about, avatar не позволят передать в req лишние данные
  // если какое-то поле не пришло, то оно в этот объект не попадет и не будет обновляться
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      // если пользователь с таким id не найден, то выдать ошибку 404
      if (!user) {
        throw new NotFoundError(
          'Пользователь с заданным id не найден',
        );
      }
      res.send(user);
    })
    .catch((err) => {
      // если произошла ошибка валидации данных, то выдать ошибку 400
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestError(
            `Неверный формат данных при обновлении пользователя ${err.message}`,
          ),
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
      const token = jsonwebtoken.sign({ _id: user._id }, JWT_SALT, {
        expiresIn: '7d',
      });

      // вернём токен
      // можно вернуть его просто в ответе: res.send({ token });
      // можно вернуть как httpOnly-куку
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Authorization successful' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  getUserMe,
  updateUserData,
  login,
};
