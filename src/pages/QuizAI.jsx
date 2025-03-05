import { useNavigate } from "react-router-dom";
import QuizQuestion from "../components/QuizQuestion";
import CreateQuizAI from "../pages/CreateQuizAI";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createQuiz } from "../services/quizService";

function QuizAI() {
    const [generated, setGenerated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated, loading: authLoading, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return; 
        if (!isAuthenticated) {
            navigate("/"); 
            return;
        }

        setLoading(false)
        navigate("/quiz-generation");
    }, [loading, isAuthenticated, navigate]);

    return (
        <>
            <CreateQuizAI setGenerated={setGenerated} />

            {generated && (
                <div className="quiz-container acceptance">
                    <div className="additional-container">
                        <div className="left">
                            <div className="top">
                                <h4>Accepted Questions</h4>

                                <div className="accepted-list">
                                    <div className="accepted-box">
                                        <p>How many legs on a cheetah...</p>
                                    </div>
                                    <div className="accepted-box">
                                        <p>How many legs on a cheetah...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="button-options">
                                <button>Cancel</button>
                                <button>Save</button>
                            </div>
                        </div>
                        <div className="right">
                            <QuizQuestion />
                            <div className="button-options">
                                <button>Decline</button>
                                <button>Accept</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default QuizAI;
