import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../services/quizService";
import QuizQuestion from "../components/QuizQuestion";
import { AuthContext } from "../context/AuthContext";
import "../styles/quizStyle.css";

function QuizManual() {
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    isAuthenticated,
    loading: authLoading,
    token,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    setLoading(false);
    navigate("/quiz-manual");
  }, [loading, isAuthenticated, navigate]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "",
        options: [
          { id: Date.now() + 1, text: "", isCorrect: false },
          { id: Date.now() + 2, text: "", isCorrect: false },
          { id: Date.now() + 3, text: "", isCorrect: false },
          { id: Date.now() + 4, text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const updateQuestion = (questionId, updatedQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? updatedQuestion : q))
    );
  };

  const removeQuestion = (questionId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleSubmit = async () => {
    setError(null); // Clear any existing error before submitting
    if (!quizName.trim()) return setError("Please enter a quiz name");
    if (questions.length === 0)
      return setError("Please add at least one question");

    for (const question of questions) {
      if (!question.text.trim())
        return setError("All questions must have text");
      if (!question.options.some((opt) => opt.isCorrect))
        return setError("Each question must have at least one correct answer");
      if (question.options.some((opt) => !opt.text.trim()))
        return setError("All options must have text");
    }

    try {
      const formattedQuestions = questions.map((q) => ({
        text: q.text,
        options: q.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      }));

      setLoading(true); // Set loading state to true while submitting the quiz
      await createQuiz({ title: quizName, questions: formattedQuestions });
      navigate("/userHome");
    } catch (err) {
      setError("Failed to create quiz");
      console.error("Error creating quiz:", err);
    } finally {
      setLoading(false); // Reset loading state after operation
    }
  };

  const handleCancel = () => {
    navigate("/userHome");
  };

  return (
    <div className="quiz-container manual">
      <div className="additional-container">
        <div className="quiz-container-box">
          <h3>Create a new quiz</h3>
          <input
            id="quizName"
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Enter a quiz name"
          />
          <button onClick={addQuestion} className="add-question-btn">
            <i className="fa-solid fa-square-plus"></i>
            Create Question
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="quiz-list">
          {questions.map((question) => (
            <QuizQuestion
              key={question.id}
              question={question}
              onUpdate={(updatedQuestion) =>
                updateQuestion(question.id, updatedQuestion)
              }
              onRemove={() => removeQuestion(question.id)}
            />
          ))}
        </div>
        {questions.length > 0 && (
          <div className="quiz-btn-options">
            <button onClick={handleCancel} className="cancel-quiz-btn">
              Cancel
            </button>
            <button onClick={handleSubmit} className="save-quiz-btn">
              Save Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizManual;
