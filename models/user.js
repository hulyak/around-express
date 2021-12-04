const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/gm.test(
          v
        ),
      message: "{VALUE} is not a valid URL!",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  verifyPassword: {
    type: String,
    required: true,
    minlength: 8,
  },
});

// add custom method to userSchema with statics property
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email }).then((user) => {
    //  this — the User model
    if (!user) {
      return Promise.reject(new Error("Incorrect email or password"));
    }
    // comparing the submitted password and hash from the database
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return user;
    });
  });
};

module.exports = mongoose.model("user", userSchema);
