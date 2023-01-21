const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")

dotenv.config();

mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(() => console.log("Db is connected Successfully"))
  .catch((err) => {console.log("Error", err)});

  app.use(express.json())

  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
 
  app.listen(process.env.PORT || 6000, () => {
  console.log("Backend Server is runing at 6000 Port");
});
