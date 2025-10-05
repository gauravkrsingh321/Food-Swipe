import React from 'react';
import { Link } from 'react-router';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

const FoodPartnerRegister = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  const businessName = e.target.businessName.value.trim();
  const contactName = e.target.contactName.value.trim();
  const phone = e.target.phone.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;
  const address = e.target.address.value.trim();

  // Basic validation
  if (!businessName || !contactName || !phone || !email || !password || !address) {
    alert("All fields are required.");
    return;
  }

  if (!/^\+?\d{7,15}$/.test(phone)) {
    alert("Please enter a valid phone number.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Please enter a valid email.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/food-partner/register`,
      {
        name: businessName,
        contactName,
        phone,
        email,
        password,
        address,
      },
      { withCredentials: true }
    );

    console.log(response.data);
    navigate("/create-food"); // Redirect after success
  } catch (error) {
    console.error("There was an error registering!", error);
    alert(error.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-register-title">
        <header>
          <h1 id="partner-register-title" className="auth-title">Partner sign up</h1>
          <p className="auth-subtitle">Grow your business with our platform.</p>
        </header>
        <nav className="auth-alt-action" style={{marginTop: '-4px'}}>
          <strong style={{fontWeight:600}}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
        </nav>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="businessName">Business Name</label>
            <input id="businessName" name="businessName" placeholder="Tasty Bites" autoComplete="organization" />
          </div>
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="contactName">Contact Name</label>
              <input id="contactName" name="contactName" placeholder="Jane Doe" autoComplete="name" />
            </div>
            <div className="field-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" placeholder="+1 555 123 4567" autoComplete="tel" />
            </div>
          </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
            </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create password" autoComplete="new-password" />
          </div>
          <div className="field-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" placeholder="123 Market Street" autoComplete="street-address" />
            <p className="small-note">Full address helps customers find you faster.</p>
          </div>
          <button className="auth-submit" type="submit">Create Partner Account</button>
        </form>
        <div className="auth-alt-action">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;