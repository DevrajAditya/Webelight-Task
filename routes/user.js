const router = require("express").Router();
const User = require("../models/User");
const isLoggedIn = require('./verifyToken')
const {
  verifyToken,
  verifyTokenAndAuthentication,
  verifyTokenAndAdmin,
} = require("./verifyToken");


/**
 * Update User route
 * @param:id
 * 
 */

router.put("/:id", verifyTokenAndAuthentication, async (req, res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SEC
          ).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    })

/**
 * Delete User route
 * @param:id
 * 
 */
router.delete("/:id", async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been Deleted... ");
    } catch (error) {
      res.status(500).json(error);
    }
  });


/**
 * Search User 
 * Only Admin can find the user
 */
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Find all User 
 * Only Admin can find all user
 */
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router;