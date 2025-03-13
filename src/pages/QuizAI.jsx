import { useNavigate } from "react-router-dom";
import GeneratedQuestion from "../components/GeneratedQuestion";
import CreateQuizAI from "../pages/CreateQuizAI";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createQuiz } from "../services/quizService";

import "../styles/quizStyle.css"

function QuizAI() {
    const [generated, setGenerated] = useState(false);
    const [generatedQuizTitle, setGeneratedQuizTitle] = useState("");
    const [generatedQuiz, setGeneratedQuiz] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [acceptedQuestions, setAcceptedQuestions] = useState([]);

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

    useEffect(() => {
        console.log("Generated state changed:", generated);
        console.log("Generated Quiz Length:", generatedQuiz.length);
    }, [generated, generatedQuiz]);    

    const handleQuestionUpdate = (updatedQuestion) => {
        setGeneratedQuiz(prevQuiz => {
            const updatedQuiz = [...prevQuiz];
            updatedQuiz[currentQuestionIndex] = updatedQuestion;
            return updatedQuiz;
        });
    };

    const handleAcceptQuestion = () => {
        if (generatedQuiz.length > 0) {
            const currentQuestion = generatedQuiz[currentQuestionIndex];

            const hasCorrectAnswer = currentQuestion.options.some(opt => opt.isCorrect);

            if(!hasCorrectAnswer) {
                alert("The generated question must have one correct answer before accepting!")
                return
            }

            setAcceptedQuestions(prev => [...prev, currentQuestion]);

            if (currentQuestionIndex < generatedQuiz.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setGenerated(false);
            }
        }
    };

    const handleDeclineQuestion = () => {
        if (currentQuestionIndex < generatedQuiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGenerated(false);
        }
    };

    const handleNewQuizGeneration = (quiz) => {
        console.log("Received quiz data:", quiz);
    
        if (!quiz?.questions?.length) {
            console.error("Quiz format invalid or empty:", quiz);
            return;
        }

        setGeneratedQuizTitle(quiz.quizTitle);
    
        const formattedQuiz = quiz.questions.map(q => ({
            text: q.question,
            options: q.choices.map(choice => ({
                id: Math.random().toString(36).substr(2, 9),
                text: choice,
                isCorrect: choice === q.correctAnswer
            }))
        }));
    
        setGeneratedQuiz(formattedQuiz);
        setGenerated(true);
        setCurrentQuestionIndex(0);
        setAcceptedQuestions([]);
    };

    const handleSaveQuiz = async () => {
        try {
            if (!generatedQuiz || !generatedQuizTitle || acceptedQuestions.length === 0) {
                console.error("Missing quiz title or no accepted questions");
                setError("Cannot save an empty quiz");
                return;
            }
    
            const formattedQuestions = acceptedQuestions.map(q => ({
                text: q.text,
                options: q.options.map(opt => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect
                }))
            }));
    
            await createQuiz({ title: generatedQuizTitle, questions: formattedQuestions }, token);
            
            setGenerated(false);
            setGeneratedQuiz({ quizTitle: "", questions: [] });
            setAcceptedQuestions([]);
            navigate('/userHome');
        } catch (err) {
            setError("Failed to save quiz");
            console.error("Error creating quiz:", err);
        }
    };

    return (
        <div className="quiz-generation-container quiz-container">
            <div className="additional-container">
            {!generated && (
                <CreateQuizAI 
                setGenerated={setGenerated} 
                setGeneratedQuiz={handleNewQuizGeneration}
                />
            )}

            {generated && generatedQuiz.length > 0 && (
                <div className="quiz-container acceptance">
                    <div className="additional-container">
                        <div className="left">
                            <div className="top">
                                <h4>Accepted Questions</h4>
                                <div className="accepted-list">
                                    {acceptedQuestions.map((question, index) => (
                                        <div key={index} className="accepted-box">
                                            <p>{question.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="button-options">
                                <button onClick={() => {
                                    setGenerated(false);
                                    setGeneratedQuiz([]); // Reset properly
                                }}>
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveQuiz}
                                    disabled={acceptedQuestions.length === 0}
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {generatedQuiz.length > 0 && (
                            <div className="right">
                                <GeneratedQuestion
                                    question={generatedQuiz[currentQuestionIndex]}
                                    onUpdate={handleQuestionUpdate}
                                />
                                <div className="button-options">
                                    <button onClick={handleDeclineQuestion}>Decline</button>
                                    <button onClick={handleAcceptQuestion}>Accept</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            </div>
        </div>
    );
}

export default QuizAI;