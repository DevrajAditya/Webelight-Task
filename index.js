const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(() => console.log("Db is connected Successfully"))
  .catch((err) => {console.log("Error", err)});

  app.use(session({
    name: '',
    secret: process.env.PASSWORD_SEC,
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 7,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
}));

  app.use(express.json())

  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/products", productRoute);
 
  app.listen(process.env.PORT || 6000, () => {
  console.log("Backend Server is runing at 6000 Port");
});
