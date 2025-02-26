// Other
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Styling
import "../styles/appStyle.css";

function LoginRegisterModal({ isOpen, onClose, mode, onSwitchMode }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationError, setValidationError] = useState(null);

  const { login, register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFormData(prevFormData => ({
        username: mode === 'register' ? '' : prevFormData.username,
        email: '',
        password: '',
        confirmPassword: ''
      }));
      setValidationError(null);
      clearError();
    }
  }, [isOpen, mode]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      onClose();
      navigate('/userHome');
    }
  }, [isAuthenticated, navigate, onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
  
    if (mode === 'register') {
      if (!formData.username.trim()) {
        return setValidationError('Username is required');
      }
      if (formData.password !== formData.confirmPassword) {
        return setValidationError('Passwords do not match');
      }
      if (formData.password.length < 6) {
        return setValidationError('Password must be at least 6 characters');
      }
  
      try {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      } catch (err) {
        console.error("Registration error:", err);
        setValidationError(err.message || "Registration failed");
      }
    } else {
      try {
        await login({
          email: formData.email,
          password: formData.password
        });
      } catch (err) {
        console.error("Login error:", err);
        setValidationError(err.message || "Login failed");
      }
    }
  };
  

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>x</button>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {(error || validationError) && (
          <div className="error-message">
            {validationError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div>
              <label>Username</label>
              <input 
                type="text" 
                id="username"
                name="username"
                placeholder="Enter username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>
          )}

          <div>
            <label>Email</label>
            <input 
              type="email" 
              id="email"
              name="email"
              placeholder="Enter email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label>Password</label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password" 
              required 
            />
          </div>

          {mode === "register" && (
            <div>
                <label>Password</label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter password" 
                  required 
                />
            </div>
            )

          }

          <button id="submit-btn" type="submit">{mode === "login" ? "Login" : "Register"}</button>
        </form>

        <p className="account-qa">
          {mode === "login" ? (
            <>
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode("register"); } }>Register</a>
            </>
          ) : (
            <>
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode("login"); } }>Login</a>
            </>
          )}
        </p>

      </div>
    </div>
  );
}

export default LoginRegisterModal;
