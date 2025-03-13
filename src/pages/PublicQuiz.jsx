import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getQuiz,
  joinQuiz,
  getUser,
  submitQuiz,
} from "../services/quizService";

import "../styles/takeQuizStyle.css";

function PublicQuiz() {
  const { id } = useParams(); // This should be the `joinCode`
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    console.log(id);

    const fetchQuiz = async () => {
      try {
        const data = await joinQuiz(id);

        const correctList = data.questions.reduce((acc, question) => {
          const correctOption = question.options.find(
            (option) => option.isCorrect
          );
          if (correctOption) {
            acc[question._id] = correctOption.text;
          }
          return acc;
        }, {});

        setCorrectAnswers(correctList);
        setQuiz(data);
      } catch (err) {
        setError(err.message || "Failed to load quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
    setLoading(false);
    navigate(`/quiz/join/${id}`);
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    if (selectedOption === null) return alert("Please select an answer!");

    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [currentQuestion._id]: selectedOption,
      };

      if (currentQuestionIndex === quiz.questions.length - 1) {
        const finalScore = calculateScore(updatedAnswers);
        handleFinalSubmission(finalScore);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }

      return updatedAnswers;
    });

    setSelectedOption(null);
  };

  const calculateScore = (finalAnswers) => {
    let score = 0;

    quiz.questions.forEach((question) => {
      const selectedOption = finalAnswers[question._id];
      const correctOption = correctAnswers[question._id];

      if (selectedOption === correctOption) {
        score += 1;
      }
    });

    console.log(`Your final score is: ${score} / ${quiz.questions.length}`);

    return score;
  };

  const handleFinalSubmission = async (userScore) => {
    try {
      const user = await getUser();
      if (!user || !user._id) {
        console.log("User not found");
      }

      await submitQuiz({ code: id, userId: user._id, score: userScore });
      navigate("/userHome");
    } catch (error) {
      alert("Quiz submission failed", error.essage);
    }
  };

  return (
    <div className="quiz-container">
      <div className="additional-container">
        <h2>{quiz.title}</h2>
        <div className="question-container">
          <h3>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </h3>
          <p>{currentQuestion.text}</p>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li
                key={index}
                className={`quiz-option ${
                  selectedOption === option.text ? "selected" : ""
                }`}
                onClick={() => setSelectedOption(option.text)}
              >
                {option.text}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleNext} className="submit-btn">
          {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
}

export default PublicQuiz;
