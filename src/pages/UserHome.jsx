import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserQuizzes, joinQuiz, deleteQuiz, getQuizScores, getSpecificUser } from "../services/quizService";

import "../styles/userHomeStyle.css";

function UserHome() {
  const [code, setCode] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state added

  const [scoresModalOpen, setScoresModalOpen] = useState(false);
  const [quizScores, setQuizScores] = useState([]);

  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // Don't fetch if auth is still loading
    if (!isAuthenticated) {
      navigate("/"); // Redirect to home page if not authenticated
      return; // Stop further execution after navigation
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
  }, [authLoading, isAuthenticated, navigate]);

  const handleJoin = async () => {
    setError(null);
    const trimmedCode = code.trim();

    if (!trimmedCode) {
        setError("Please enter a valid code.");
        return;
    }

    try {
      console.log("Joining quiz with code:", trimmedCode);
      const quiz = await joinQuiz(trimmedCode); // Use joinCode, not ID

      if (!quiz) {
        throw new Error("Quiz not found");
      }
      navigate(`/quiz/join/${trimmedCode}`);
    } catch (err) {
      setError(err.message);
    }

    // navigate(`/quiz/join/${trimmedCode}`);
  };

  const handleDelete = async (quizId) => {
    try {
      await deleteQuiz(quizId);

      const updatedQuizzes = await getUserQuizzes();
      setQuizzes(updatedQuizzes);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewScores = async (quizId) => {
    try {
      const quiz = await getQuizScores(quizId);
      const participants = quiz.participants;

      // Fetch emails for each participant
      const quizScoresFormatted = await Promise.all(participants.map(async (participant) => {
        try {
          const user = await getSpecificUser(participant.user);
          return {
            userId: participant.user,
            email: user.email,  // Include the email
            score: participant.score
          };
        } catch (error) {
          console.error(`Failed to fetch user ${participant.user}:`, error.message);
          return {
            userId: participant.user,
            email: "Unknown",
            score: participant.score
          };
        }
      }));

      console.log(quizScoresFormatted); 

      setQuizScores(quizScoresFormatted);
      setScoresModalOpen(true)
    } catch (err) {
      console.error("Error fetching scores:", err);
      setError("Failed to fetch quiz scores");
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
                <button
                  type="button"
                  onClick={() => {
                    console.log("Navigating to quizManual");
                    navigate("/quiz-manual");
                  }}
                >
                  Create Quiz Manually
                </button>

                <span>/</span>

                <button
                  type="button"
                  onClick={() => {
                    console.log("Navigating to quiznew");
                    navigate("/quiz-generation");
                  }}
                >
                  Generate With AI
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-container">
          <h3>Your Quizzes</h3>

          {loading ? (
            <p className="lil-msg">Loading your quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p className="lil-msg">You haven't created any quizzes yet. Create your first quiz!</p>
          ) : (
            <div className="quiz-list">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="quiz-item">
                  <div className="quiz-info">
                    <h4>{quiz.title}</h4>
                    <p className="num-questions">
                      Questions: {quiz.questions.length}
                    </p>
                    <p className="join-code">
                      Join Code: <strong>{quiz.joinCode}</strong>
                    </p>
                  </div>
                  <div className="quiz-actions">
                    <Link to={`/quiz/${quiz._id}`}>
                      <button className="view-btn">Start</button>
                    </Link>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(quiz._id)}
                    >
                      Delete
                    </button>
                    <button
                        className="score-btn"
                        onClick={() => handleViewScores(quiz._id)}
                    >
                        Score
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {scoresModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Quiz Scores</h2>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {quizScores.length === 0 ? (
                  <tr>
                    <td colSpan="2">No scores available</td>
                  </tr>
                ) : (
                  quizScores.map((score, index) => (
                    <tr key={index}>
                      <td>{score.email}</td>
                      <td>{score.score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <button className="close-btn" onClick={() => setScoresModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default UserHome;
