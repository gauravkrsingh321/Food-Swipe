const express = require('express');
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
router.get('/user/check',authMiddleware.authUserMiddleware, (req,res)=>{
  return res.status(200).json({
    success:true,
    message:"User is authenticated",
    user:req.user
  })
})


// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)
router.get('/food-partner/check',authMiddleware.authFoodPartnerMiddleware, (req,res)=>{
  return res.status(200).json({
    success:true,
    message:"Food-Partner is authenticated",
    foodPartner:req.foodPartner
  })
})



module.exports = router;