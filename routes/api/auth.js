const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// user model
const User = require("../../models/User");

// @route post api/auth
// @desc  Auth user
// @access public

router.post("/", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  //  simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all field" });
  }

  //   check for existing user

  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: "user Does not exist!" });

    // validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    });
  });
});

// @route get api/auth/user
// @desc  set user data
// @access private

router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
});

module.exports = router;
