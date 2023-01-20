const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const userRoute = require("./routes/user")

dotenv.config();

mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(() => console.log("Db is connected Successfully"))
  .catch((err) => {console.log("Error", err)});

  app.use(express.json())

  app.get("/api/test", (req,res)=>{
    console.log("test api");
    res.send("Api test successfull");
  })
  app.use("/api/user", userRoute);
 
  app.listen(process.env.PORT || 6000, () => {
  console.log("Backend Server is runing at 6000 Port");
});
