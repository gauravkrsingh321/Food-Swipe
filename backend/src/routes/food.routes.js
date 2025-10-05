const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood)


/* GET /api/food/ [protected] */
router.get("/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems)

router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood)

//saved routes
router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)


router.get('/allSave',
    authMiddleware.authUserMiddleware,
    foodController.getAllSaveFood
)

router.get('/singleSave/:foodId',
    authMiddleware.authUserMiddleware,
    foodController.getSingleSavedFood
)

// Add comment
router.post('/comment/:foodId',
    authMiddleware.authUserMiddleware,
    foodController.createComment
);

// Edit comment
router.put('/comment/:commentId',
    authMiddleware.authUserMiddleware,
    foodController.editComment
);

// Delete comment
router.delete('/comment/:commentId',
    authMiddleware.authUserMiddleware,
    foodController.deleteComment
);

// Get all comments for a specific food
router.get('/comments/:foodId',
    foodController.getAllComments
);



module.exports = router