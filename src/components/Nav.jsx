import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import "../styles/navStyle.css";

function Nav({ onOpenModal }) {
    const { isAuthenticated, user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav>
                <div className="logo">
                    <Link to="/">.</Link>
                </div>

                <ul>
                {isAuthenticated ? (
                    <>
                        <span className="welcome-message">Welcome, {user?.username || 'User'}</span>
                        <button className="auth-btn logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                    ) : (
                    <>
                        <button className="auth-btn login" onClick={() => onOpenModal('login')}>
                            Login
                        </button>
                        <button className="auth-btn register" onClick={() => onOpenModal('register')}>
                            Register
                        </button>
                    </>
                )}
                </ul>
            </nav>
        </>
    )
}

export default Nav;