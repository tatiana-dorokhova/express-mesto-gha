const router = require("express").Router(); // создали роутер
const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards); // возвращает все карточки

router.delete("/cards/:cardId", deleteCardById); // удаляет карточку по идентификатору

router.post("/cards", createCard); // создаёт карточку

router.put("/cards/:cardId/likes", likeCard); // поставить лайк карточке

router.put("/cards/:cardId/likes", dislikeCard); // убрать лайк с карточки

module.exports = router;
