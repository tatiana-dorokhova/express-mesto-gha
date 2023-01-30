const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_ERROR, JWT_SALT } = require("../utils/constants");

module.exports = (req, res, next) => {
  const { jwtToken } = req.cookies;

  if (!jwtToken) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Необходима авторизация: не пришел токен в куках" });
  }

  const token = jwtToken.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SALT);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Необходима авторизация: токен пришел, но не выверен" });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
