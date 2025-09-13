import React from 'react';
import { Link } from 'react-router';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

const UserRegister = () => {

    const navigate = useNavigate();

   const handleSubmit = async (e) => {
  e.preventDefault();

  const firstName = e.target.firstName.value.trim();
  const lastName = e.target.lastName.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  // basic validation
  if (!firstName || !lastName || !email || !password) {
    alert("All fields are required.");
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
      "http://localhost:3000/api/auth/user/register",
      {
        fullName: firstName + " " + lastName,
        email,
        password,
      },
      { withCredentials: true }
    );

    console.log(response.data);
    navigate("/");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Registration failed");
  }
};


    return (
        <div className="auth-page-wrapper">
            <div className="auth-card" role="region" aria-labelledby="user-register-title">
                <header>
                    <h1 id="user-register-title" className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join to explore and enjoy delicious meals.</p>
                </header>
                <nav className="auth-alt-action" style={{ marginTop: '-4px' }}>
                    <strong style={{ fontWeight: 600 }}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
                </nav>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="two-col">
                        <div className="field-group">
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" name="firstName" placeholder="John" autoComplete="given-name" />
                        </div>
                        <div className="field-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" name="lastName" placeholder="Doe" autoComplete="family-name" />
                        </div>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" />
                    </div>
                    <button className="auth-submit" type="submit">Sign Up</button>
                </form>
                <div className="auth-alt-action">
                    Already have an account? <Link to="/user/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;