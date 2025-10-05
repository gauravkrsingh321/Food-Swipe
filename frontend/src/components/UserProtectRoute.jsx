import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate} from "react-router";

const UserProtectRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    
    try {
      const res = await axios.get("https://food-swipe-frontend.onrender.com/api/auth/user/check", {
        withCredentials: true,
      });
      // console.log(res.data.user)
      setUser(res.data.user._id);
    } catch (error) {
      console.log(error)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (loading) return <div className="loader-container">
    <div className="loader"></div>
  </div>

  if (!user) return <Navigate to="/user/login" replace />

  return children;
};

export default UserProtectRoute;
