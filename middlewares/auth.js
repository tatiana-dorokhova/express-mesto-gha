const jsonwebtoken = require('jsonwebtoken');
const { JWT_SALT } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = jwt.replace('Bearer ', '');
  let payload;

  try {
    payload = jsonwebtoken.verify(token, JWT_SALT);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
