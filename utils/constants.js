const INTERNAL_SERVER_ERROR = 500;
const INT_SERV_ERR_MESSAGE = "На сервере произошла ошибка";

const JWT_SALT = "q7jb40keq1";

const REGEX_PASSWORD_PATTERN = /^[a-zA-Z0-9]{8,}$/;
const REGEX_URL_PATTERN =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  INTERNAL_SERVER_ERROR,
  INT_SERV_ERR_MESSAGE,
  JWT_SALT,
  REGEX_PASSWORD_PATTERN,
  REGEX_URL_PATTERN,
};
