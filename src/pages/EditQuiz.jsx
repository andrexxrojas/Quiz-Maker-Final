import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, editQuiz } from "../services/quizService";
import { AuthContext } from "../context/AuthContext";
import "../styles/editStyle.css";

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ title: "", questions: [] });
  const [loading, setLoading] = useState(true);

  const {
    isAuthenticated,
    loading: authLoading,
    token,
  } = useContext(AuthContext);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    async function fetchQuiz() {
      try {
        const data = await getQuiz(id);
        setQuiz(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchQuiz();
    setLoading(false);
    navigate(`/quiz/edit/${id}`);
  }, [loading, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, newText) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index].text = newText;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Handle option text change
  const handleOptionChange = (qIndex, oIndex, newText) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex].text = newText;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSave = async () => {
    try {
      await editQuiz(id, quiz);
      alert("Quiz updated successfully!");
      navigate("/userHome"); // Redirect after saving
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };

  const handleCorrectToggle = (qIndex, oIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map(
      (option, i) => ({
        ...option,
        isCorrect: i === oIndex, // Only one option can be correct
      })
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  return (
    <div className="quiz-container edit">
      <div className="additional-container edit">
        <h2>Edit Quiz</h2>
        <input
          id="title-edit"
          type="text"
          name="title"
          value={quiz.title}
          onChange={handleChange}
        />

        <h3>Questions</h3>
        <div className="quiz-question-container">
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="edit-question">
              <input
                className="edit-question-title"
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />

              <div className="option-container">
                {question.options.map((option, oIndex) => (
                  <div className="option" key={oIndex}>
                    <input
                      type="text"
                      placeholder="Type answer here"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                    />
                    <div className="option-choices">
                      <button
                        className="delete-btn"
                        onClick={() => removeOption(qIndex, oIndex)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                      <button
                        className={option.isCorrect ? "correct" : ""}
                        onClick={() => handleCorrectToggle(qIndex, oIndex)}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    </div>
                    {question.options.length < 4 && (
                      <button
                        className="add-option-btn"
                        onClick={() => addOption(qIndex)}
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="edit-options">
          <button onClick={() => { navigate("/userHome") }} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="submit-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditQuiz;
