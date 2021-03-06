const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res.status(401).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

const auth = (req, res, next) => {
  // getting authorization from the header
  const { authorization } = req.headers;

  // let's check the header exists and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }
  // if the token is valid, we can set the user on the request
  const token = extractBearerToken(authorization);
  let payload;

  try {
    // payload = jwt.verify(authorization.substring(7), process.env.JWT_SECRET);
    // verifying the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return handleAuthError(res);
  }
  req.user = payload; // assigning the payload to the request object

  next(); // sending the request to the next middleware
};

const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidEmail = (email) => {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailRegex.test(email);
};

const validateUserInput = ({ email, password }) => {
  const result = {
    isValidated: isValidPassword(password) && isValidEmail(email),
    message: null,
    error: null,
  };

  if (isValidPassword(password) && isValidEmail(email)) {
    result.message = "User created successfully";
  } else if (isValidEmail(email) && !isValidPassword(password)) {
    result.error = "Wrong password";
  } else if (!isValidEmail(email) && isValidPassword(password)) {
    result.error = "Wrong email";
  } else {
    result.error = "Incorrect data";
  }

  return result;
};

module.exports = {
  auth,
  validateUserInput,
  isValidEmail,
  isValidPassword,
};
