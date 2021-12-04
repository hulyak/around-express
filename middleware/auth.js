const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res.status(401).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
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
