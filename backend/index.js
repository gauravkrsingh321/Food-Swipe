const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require("./src/routes/auth.routes.js");
const foodRoutes = require('./src/routes/food.routes.js');
const foodPartnerRoutes = require('./src/routes/food-partner.routes');
require('dotenv').config();
const connectDB = require('./src/config/db.js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: "https://food-swipe-frontend.onrender.com",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner',foodPartnerRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})  