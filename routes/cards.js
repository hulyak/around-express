const fsPromises = require("fs").promises;
const path = require("path");
const cardsRouter = require("express").Router();

const filePath = path.join(__dirname, "../data/cards.json");

cardsRouter.get("/", (req, res) => {
  fsPromises
    .readFile(filePath, "utf-8")
    .then((data) => {
      const cards = JSON.parse(data);
      res.json(cards);
    })
    .catch((err) => console.log(err));
});

module.exports = cardsRouter;
