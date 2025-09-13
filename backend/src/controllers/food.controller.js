  const foodModel = require("../models/food.model");
  const storageService = require("../services/storage.service");
  const likeModel = require("../models/likes.model");
  const saveModel = require("../models/save.model");
  const { v4: uuid } = require("uuid");

  async function createFood(req, res) {
    try {
      // Validate input
      if (!req.file || !req.body.name || !req.body.description) {
        return res
          .status(400)
          .json({ message: "Name, description, and file are required" });
      }
      // Upload file
      const fileUploadResult = await storageService.uploadFile(
        req.file.buffer,
        uuid() //uuid will generate an unique id
      ); 

      // Create food item
      const { name, description } = req.body;
      const foodItem = await foodModel.create({
        name: name,
        description: description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id,
      });

      res.status(201).json({
        message: "food created successfully",
        food: foodItem,
      });
    } catch (error) {
      console.error("Error creating food:", error); // log for debugging
      return res.status(500).json({
        message: "Error in creating food item",
      });
    }
  }

  async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find({});
      res.status(200).json({
        message: "Food items fetched successfully",
        allFoodItems: foodItems,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error in fetching food item",
      });
    }
  }

  async function likeFood(req, res) {
      try {
        const { foodId } = req.body;
        const user = req.user;
      
        const isAlreadyLiked = await likeModel.findOne({
          user: user._id,
          food: foodId,
        });
      
        if(isAlreadyLiked) {
          await likeModel.deleteOne({
            user: user._id,
            food: foodId,
          });
      
          await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 },
          });
      
          return res.status(200).json({
            message: "Food unliked successfully",
          });
        }
      
        const like = await likeModel.create({
          user: user._id,
          food: foodId,
        });
      
        await foodModel.findByIdAndUpdate(foodId, {
          $inc: { likeCount: 1 },
        });
      
        res.status(201).json({
          message: "Food liked successfully",
          like,
        });
      } catch (error) {
        console.log("Error in liking food",error);
      return res.status(500).json({
          message: "Error in liking food",
        });
      }
  }

  async function saveFood(req, res) {
    try {
      const { foodId } = req.body;
      const user = req.user;
    
      const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId,
      });
    
      if (isAlreadySaved) {
        await saveModel.deleteOne({
          user: user._id,
          food: foodId,
        });
    
        await foodModel.findByIdAndUpdate(foodId, {
          $inc: { savesCount: -1 },
        });
    
        return res.status(200).json({
          message: "Food unsaved successfully",
        });
      }
    
      const save = await saveModel.create({
        user: user._id,
        food: foodId,
      });
    
      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 },
      });
    
      res.status(201).json({
        message: "Food saved successfully",
        save,
      });
    } catch (error) {
      console.log("Error in saving food",error);
      return res.status(500).json({
        message: "Error in saving food",
      });
    }
  }

  async function getSaveFood(req, res) {
  try {
    const user = req.user;
  
    const savedFoods = await saveModel.find({ user: user._id }).populate("food");
  
    if (!savedFoods || savedFoods.length === 0) {
      return res.status(404).json({ message: "No saved foods found" });
    }
  
    res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods,
    });
  } catch (error) {
    console.log("Error in saving food",error);
    return res.status(500).json({
        message: "Error in retrieving saving food",
      });
  }
  }

  module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
  };
