const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require('config');

const app = express();

// bodyParser Middleware
app.use(express.json());

// DB config
const db = config.get('mongoURI');

// connect mongodb
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("mongoDB connected!"))
  .catch(err => console.log(err));

// routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));


// PORT
const port = process.env.PORT || 5000;

// Server Start
app.listen(port, () => console.log(`server start ${port}`));
