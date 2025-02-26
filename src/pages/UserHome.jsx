import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserQuizzes, joinQuiz } from "../services/quizService";

import "../styles/userHomeStyle.css";

function UserHome() {
    const [code, setCode] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error state added

    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return; // Don't fetch if auth is still loading
        if (!isAuthenticated) {
            navigate("/"); // Redirect if not authenticated
        }

        const fetchQuizzes = async () => {
            try {
                const data = await getUserQuizzes();
                setQuizzes(data);
            } catch (err) {
                setError("Failed to load quizzes");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) fetchQuizzes(); // Only fetch if authenticated
    }, [isAuthenticated, authLoading, navigate]);

    const handleJoin = async () => {
        const trimmedCode = code.trim().toUpperCase();
        if (trimmedCode.length !== 6 || !/^[A-Z0-9]{6}$/.test(trimmedCode)) {
            setError("Invalid join code format");
            return;
        }

        try {
            const quiz = await joinQuiz(trimmedCode);
            navigate(`/quiz/${quiz._id}`);
        } catch (err) {
            setError("Invalid join code");
            console.error(err);
        }
    };

    return (
        <div className="user-home-container">
            <div className="additional-container">
                <div className="top-container">
                    <div className="join-container">
                        <div className="join-box">
                            <input
                                type="text"
                                placeholder="Enter a join code"
                                className="join-input"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button className="join-btn" onClick={handleJoin}>
                                Join
                            </button>
                        </div>
                    </div>

                    <div className="generate-container">
                        <div className="generate-box">
                            <h3>Make a Quiz</h3>

                            <div className="choice-container">
                                <button type="button" onClick={() => { navigate("/quizManual"); }}>
                                    Manual
                                </button>
                                <span>/</span>
                                <button type="button" onClick={() => { navigate("/quiznew"); }}>
                                    Generate With AI
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bottom-container">
                    <h3>Your Quizzes</h3>

                    {loading ? (
                        <p>Loading your quizzes...</p>
                    ) : quizzes.length === 0 ? (
                        <p>You haven't created any quizzes yet. Create your first quiz!</p>
                    ) : (
                        <div className="quiz-list">
                            {quizzes.map((quiz) => (
                                <div key={quiz._id} className="quiz-item">
                                    <h4>{quiz.title}</h4>
                                    <p>Questions: {quiz.questions.length}</p>
                                    <p>Join Code: <strong>{quiz.joinCode}</strong></p>
                                    <div className="quiz-actions">
                                        <Link to={`/quiz/${quiz._id}`}>
                                            <button className="view-btn">View</button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>} {/* Show error if any */}
        </div>
    );
}

export default UserHome;
