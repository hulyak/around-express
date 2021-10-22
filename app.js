const express = require("express");
const app = express();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// global error handling
app.use(function (req, res, next) {
  res.send({ message: "Requested resource not found" });
  return;
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
