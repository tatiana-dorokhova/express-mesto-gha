const process = require("process");
const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const handleErr = require("./middlewares/handleErr");
const cookieParser = require("cookie-parser");
const NotFoundError = require("./errors/notFoundError");
const { celebrate, Joi, errors } = require("celebrate");
const {
  REGEX_PASSWORD_PATTERN,
  REGEX_URL_PATTERN,
} = require("./utils/constants");

const app = express();
app.use(cookieParser());
app.use(express.json()); // подключение встроенного body-parser-а json в express для расшифровки тела запросов
// Слушаем 3000 порт
const { PORT = 3000, DB_CONN = "mongodb://localhost:27017/mestodb" } =
  process.env;

mongoose.set("strictQuery", false);
mongoose.connect(DB_CONN);

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).regex(REGEX_PASSWORD_PATTERN),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).default("Жак-Ив Кусто"),
      about: Joi.string().min(2).max(30).default("Исследователь"),
      avatar: Joi.string()
        .default(
          "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png"
        )
        .regex(REGEX_URL_PATTERN),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).regex(REGEX_PASSWORD_PATTERN),
    }),
  }),
  createUser
);

// в случае успеха добавляет в каждый запрос свойство req.user
// с записанным в него токеном
app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// если обращение происходит к ресурсу, не описанному выше в роутах, то выдавать ошибку 404
app.all("*", function (req, res, next) {
  return next(new NotFoundError("Запрошена несуществующая страница"));
});

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use(handleErr);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
