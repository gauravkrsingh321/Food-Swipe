import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router';

const FoodPartnerProtectRoute = ({children}) => {
  const [foodPartner, setFoodPartner] = useState(null)
  const [loading, setLoading] = useState(true);
  
    const checkFoodPartner = async () => {
      try {
        const res = await axios.get("https://food-swipe-frontend.onrender.com/api/auth/food-partner/check", {
          withCredentials: true,
        });
        // console.log(res.data.foodPartner)
        setFoodPartner(res.data.foodPartner._id);
      } catch (error) {
        console.log(error)
        setFoodPartner(null);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      checkFoodPartner();
    }, []);
  
    if (loading) return <div className="loader-container">
    <div className="loader"></div>
  </div>
  
    if (!foodPartner) return <Navigate to="/food-partner/login" replace />
  
    return children;
}

export default FoodPartnerProtectRoute