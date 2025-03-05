import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getQuiz, joinQuiz } from "../services/quizService";

function Quiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState({});
    
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return; 
        if (!isAuthenticated) {
            navigate("/"); 
            return;
        }
        
        // const fetchQuiz = async () => {
        //     try {
        //         const data = await getQuiz(id);
        //         console.log(data)
        //         setQuiz(data);
        //         setLoading(false);
        //         navigate(`/quiz/${id}`)
        //     } catch (err) {
        //         setError(err.message || "Failed to load quiz");
        //         setLoading(false);
        //     }
        // };

        const fetchQuiz = async () => {
            let data = ""

            try {
                
                if( (window.location.pathname.includes("/quiz/join/"))) {
                    data = await joinQuiz(id);
                } else {
                    data = await getQuiz(id);
                }

                console.log(data)
                setQuiz(data);
            } catch (err) {
                setError(err.message || "Failed to load quiz");
                setLoading(false);
            }
        };

        fetchQuiz();

        // setLoading(false)
        // navigate(`/quiz/${id}`);

        if( (window.location.pathname.includes("/quiz/join/"))) {
            setLoading(false)
            navigate(`/quiz/join/${id}`);
        } else {
            setLoading(false)
            navigate(`/quiz/${id}`);
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) return <p>Loading quiz...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!quiz) return <p>Quiz not found.</p>;

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleNext = () => {
        if (selectedOption === null) return alert("Please select an answer!");

        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedOption
        }));

        setSelectedOption(null); // Reset selection

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            alert("Quiz completed! Submitting answers...");
            console.log("User's answers:", answers);
            navigate("/userHome"); // Redirect after completion
        }
    };

    return (
        <div className="quiz-container">
            <h2>{quiz.title}</h2>
            <div className="question-container">
                <h3>Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
                <p>{currentQuestion.text}</p>
                <ul>
                    {currentQuestion.options.map((option, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="radio"
                                    name="quiz-option"
                                    value={option.text}
                                    checked={selectedOption === option.text}
                                    onChange={() => setSelectedOption(option.text)}
                                />
                                {option.text}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={handleNext}>
                {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Finish"}
            </button>
        </div>
    );
}

export default Quiz;