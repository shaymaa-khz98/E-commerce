const jwt = require('jsonwebtoken')

const createToken = (payload) => { // if i have an arrow function => default returning value
  return jwt.sign(
    { userId : payload},  // shorthand
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRED_TIME }
  );
};

module.exports = createToken;