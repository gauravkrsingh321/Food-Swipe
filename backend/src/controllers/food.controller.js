  const foodModel = require("../models/food.model");
  const storageService = require("../services/storage.service");
  const likeModel = require("../models/likes.model");
  const saveModel = require("../models/save.model");
  const commentModel = require("../models/comment.model"); // Assumed path
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
    
      if(isAlreadySaved) {
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

  async function getAllSaveFood(req, res) {
  try {
    const user = req.user;  
    const savedFoods = await saveModel.find({ user: user._id }).populate("food").sort({ createdAt: -1 });;
  
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

async function getSingleSavedFood(req, res) {
  try {
    const { foodId } = req.params;
    const userId = req.user._id;

    if (!foodId) {
      return res.status(400).json({ message: "Food Id is required" });
    }

    // Find the saved record and populate the food details
    const savedItem = await saveModel
      .findOne({ user:userId, food:foodId })
      .populate('food'); // This will replace food with the full food document

    if (!savedItem) {
      return res.status(404).json({ message: "Saved food not found" });
    }

    res.status(200).json({
      message: "Single saved food fetched successfully",
      foodItem: savedItem.food, // populated food document
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching single saved food item" });
  }
}



/**
 * Create a new comment for a food item.
 * Expects: req.body.text, req.body.foodId, req.user._id
 */
async function createComment(req, res) {
  try {
    const { text } = req.body;
    console.log(text);
    const foodId = req.params.foodId;
    console.log(foodId)
    const user = req.user;

    if (!text || !foodId || !user || !user._id) {
      return res.status(400).json({ message: "Text, foodId, and authenticated user required" });
    }

    // Check if the food item exists
    const foodExists = await foodModel.findById(foodId);
    if (!foodExists) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const comment = await commentModel.create({
      text: text.trim(),
      food: foodId,
      user: user._id,
    });

    // populate user for immediate frontend use
await comment.populate("user", "fullName");

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Error in creating comment" });
  }
}


/**
 * Edit an existing comment. Only the owner can edit.
 * Expects: req.body.commentId, req.body.text, req.user._id
 */
async function editComment(req, res) {
  try {
    const { text } = req.body;
    const { commentId } = req.params;
    const user = req.user;

    if (!commentId || !text || !user || !user._id) {
      return res.status(400).json({ message: "commentId, text, and authenticated user required" });
    }

    // Fetch the comment first
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the food associated with this comment exists
    const foodExists = await foodModel.findById(comment.food);
    if (!foodExists) {
      return res.status(404).json({ message: "Cannot edit comment: associated food not found" });
    }

    // Check ownership
    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    // Update the comment
    comment.text = text.trim();
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error("Error editing comment:", error);
    return res.status(500).json({ message: "Error in editing comment" });
  }
}


/**
 * Delete a comment. Only the owner can delete.
 * Expects: req.body.commentId, req.user._id
 */
async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const user = req.user;

    if (!commentId || !user || !user._id) {
      return res.status(400).json({ message: "commentId and authenticated user required" });
    }

    // Fetch the comment first
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the food associated with this comment exists
    const foodExists = await foodModel.findById(comment.food);
    if (!foodExists) {
      return res.status(404).json({ message: "Cannot delete comment: associated food not found" });
    }

    // Check ownership
    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Error in deleting comment" });
  }
}


/**
 * Get all comments for a food item.
 * Expects: req.params.foodId
 */
const getAllComments = async (req, res) => {
  try {
    const { foodId } = req.params;

    // 1. Validate
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    // 2. Optional: Check food exists
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // 3. Fetch comments
    const comments = await commentModel.find({ food: foodId })
      .populate("user", "fullName") // get user name only
      .sort({ createdAt: -1 }); // latest first

    // 4. Return response
    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });

  } catch (error) {
    console.error("Error in getAllComments:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFood,
  getFoodItems,
  getSingleSavedFood,
  likeFood,
  saveFood,
  getAllSaveFood,
  createComment,
  editComment,
  deleteComment,
  getAllComments,
};
