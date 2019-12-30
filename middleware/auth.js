const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  try {
    // check for token
    if (!token) {
      res.status(401).json({ msg: "No token authorization deny" });
    }

    // verify token
    const decode = jwt.verify(token, config.get("jwtSecret"));

    // Add user from payload
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).json({ msg: "token is not valid!" });
  }
}

module.exports = auth;