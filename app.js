const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const handleErr = require('./middlewares/handleErr');

const app = express();

app.use(cookieParser());

// подключение встроенного body-parser-а json в express для расшифровки тела запросов
app.use(express.json());

// Слушаем 3000 порт
const { PORT = 3000, DB_CONN = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.set('strictQuery', false);
mongoose.connect(DB_CONN);

app.use(router);

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use(handleErr);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
