import React from 'react';
import { Link } from 'react-router';
import '../../styles/auth-shared.css';

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card choose-register" role="region" aria-labelledby="choose-register-title">
        <header>
          <h1 id="choose-register-title" className="auth-title">Register</h1>
          <p className="auth-subtitle">Pick how you want to join the platform.</p>
        </header>
        <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          <Link to="/user/register" className="auth-submit" style={{textDecoration:'none', background:'var(--color-surface-alt)', border:'1px solid var(--color-border)',padding:"0.7rem"}}>
            Register as normal user
          </Link>
          <Link to="/food-partner/register" className="auth-submit" style={{textDecoration:'none', background:'var(--color-surface-alt)', border:'1px solid var(--color-border)',padding:"0.7rem"}}>
            Register as food partner
          </Link>
        </div>
        <div className="auth-alt-action" style={{marginTop:'4px'}}>
          Already have an account? <Link to="/user/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;