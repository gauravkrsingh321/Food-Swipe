const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({
      email,
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "User cannot be registered at the moment",
    });
  }
}

async function loginUser(req, res) {  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7h",
      }
    );

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
       sameSite: "None",   // allows cross-origin
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "User cannot be logged in at the moment",
    });
  }
}

function logoutUser(req, res) {
  try {
    res.clearCookie("user_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
       sameSite: "None",   // allows cross-origin
    });
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "User cannot log out at the moment",
    });
  }
}


async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body;

    if(!name || !email || !password || !phone || !address || !contactName) {
      return res.status(400).json({
        message:"All fields are required"
      })
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
      email,
    });

    if (isAccountAlreadyExists) {
      return res.status(400).json({
        message: "Food partner account already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName,
    });

    res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        address: foodPartner.address,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
      },
    });
  } 
  catch (error) {
     return res.status(500).json({
      message: "Food partner cannot be registered at the moment",
    });
  }
}

async function loginFoodPartner(req, res) {

   try {
     const { email, password } = req.body;
 
     if(!email || !password) {
       return res.status(400).json({
         message:"All fields are required"
       })
     }
 
     const foodPartner = await foodPartnerModel.findOne({
         email
     })
 
     if (!foodPartner) {
         return res.status(400).json({
             message: "Invalid email or password"
         })
     }
 
     const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
 
     if (!isPasswordValid) {
         return res.status(400).json({
             message: "Invalid email or password"
         })
     }
 
     const token = jwt.sign({
         id: foodPartner._id,
     }, process.env.JWT_SECRET,{expiresIn:"7h"})
 
     res.cookie("partner_token", token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
        sameSite: "None",   // allows cross-origin
     });
 
     res.status(200).json({
         message: "Food partner logged in successfully",
         foodPartner: {
             _id: foodPartner._id,
             email: foodPartner.email,
             name: foodPartner.name
         }
     })
   } 
   catch (error) {
    return res.status(500).json({
      message: "Food partner cannot be logged in at the moment",
    });
   }
}

function logoutFoodPartner(req, res) {
    try {
      res.clearCookie("partner_token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
         sameSite: "None",   // allows cross-origin
      });
      res.status(200).json({
          message: "Food partner logged out successfully"
      });
    } 
    catch (error) {
      return res.status(500).json({
      message: "Food partner cannot be logged out at the moment",
    });
    }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
