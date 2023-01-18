const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json()); // подключение встроенного body-parser-а json в express для расшифровки тела запросов

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/mestodb");

// middleware добавляет в каждый запрос объект user (поэтому должен стоять в коде перед всеми остальными app.use)
app.use((req, res, next) => {
  req.user = {
    _id: "63c65e13ac59f0b49c06392b", // вставьте сюда _id созданного пользователя
  };

  next();
});

app.use("/", usersRouter);
app.use("/", cardsRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
