const router = require("express").Router(); // создали роутер
const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards); // возвращает все карточки

router.delete("/:cardId", deleteCardById); // удаляет карточку по идентификатору

router.post("/", createCard); // создаёт карточку

router.put("/:cardId/likes", likeCard); // поставить лайк карточке

router.delete("/:cardId/likes", dislikeCard); // убрать лайк с карточки

module.exports = router;
