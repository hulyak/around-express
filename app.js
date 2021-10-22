const express = require("express");
const app = express();
const userRouter = require("./routes/user");

const { PORT = 3000 } = process.env;

app.use("/users", userRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
