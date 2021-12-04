require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const auth = require("./middleware/auth");

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: "618715e3d5bbc8fd98dc7911",
  };
  next();
});

// some routes don't require auth
// for example, register and login
app.use("/users", require("./routes/users"));
// app.post("/signup", register);
// app.post("/signin", login);

// authorization
app.use(auth);

// these routes need auth
app.use("/cards", require("./routes/cards"));

// global error handling
app.use("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
