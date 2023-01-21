const process = require("process");
const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const app = express();
app.use(express.json()); // подключение встроенного body-parser-а json в express для расшифровки тела запросов
// Слушаем 3000 порт
const { PORT = 3000, DB_CONN = "mongodb://localhost:27017/mestodb" } =
  process.env;

mongoose.set("strictQuery", false);
mongoose.connect(DB_CONN);

// middleware добавляет в каждый запрос объект user (поэтому должен стоять в коде перед всеми остальными app.use)
app.use((req, res, next) => {
  req.user = {
    _id: "63c65e13ac59f0b49c06392b", // вставьте сюда _id созданного пользователя
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// если обращение происходит к ресурсу, не описанному выше в роутах, то выдавать ошибку 404
app.all("*", function (req, res) {
  res.status(404).send({ message: "Запрошена несуществующая страница" });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
