const jwt = require("jsonwebtoken");
const { JWT_SALT } = require("../utils/constants");
const UnauthorizedError = require("../errors/unauthorizedError");

module.exports = (req, res, next) => {
  const { jwtToken } = req.cookies;

  if (!jwtToken) {
    next(new UnauthorizedError("Необходима авторизация"));
    return;
  }

  const token = jwtToken.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SALT);
  } catch (err) {
    next(new UnauthorizedError("Необходима авторизация"));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
