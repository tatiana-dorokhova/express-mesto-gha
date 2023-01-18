const express = require("express");
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json()); // подключение парсинга json
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");

app.use("/", usersRouter);
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/mestodb");

// middleware для заглушки авторизации до следующего спринта
app.use((req, res, next) => {
  req.user = {
    _id: "63c65e13ac59f0b49c06392b", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
