const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { isLoggedIn } = require("./verifyToken");
// Register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong Credentails!!");

    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SEC
    );

    const Orignalpassword = hashPassword.toString(CryptoJS.enc.Utf8);

    if (Orignalpassword !== req.body.password) {
      return res.status(401).json("Wrong Password!!");
    }
    
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );

    req.session.user = {
      name: accessToken,
      isLoggedIn: true
    }

    await req.session.save();
    // res.cookie("token", accessToken, {expiresIn: "1d"})

    const { password, ...others } = user._doc;

    return res.status(200).json({...others, accessToken});
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Logout
 
router.get("/logout",async(req, res)=>{
  try {
    await req.session.destroy();
  return  res.json("User Logout Sucessfully");

} catch (err) {
    console.error('Error logging out:', err);
    return next(new Error('Error logging out'));
}

})


router.get('/testlogout', isLoggedIn, (req,res)=>{
  // if (!req.session.user){
  //   return res.json({msg: "logedout, login again"})
  // } else{
    return res.json({l:'L'})
  // }
})

module.exports = router;
