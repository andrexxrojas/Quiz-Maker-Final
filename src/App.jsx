// App.jsx
import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Nav from "./components/Nav";
import LoginRegisterModal from "./components/LoginRegisterModal";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import QuizManual from "./pages/QuizManual";
import QuizAI from "./pages/QuizAI";
import Quiz from "./pages/Quiz";
import EditQuiz from "./pages/EditQuiz";
import PublicQuiz from "./pages/PublicQuiz";

import "./App.css"

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleOpenModal = (mode) => {
    setAuthMode(mode);
    setModalOpen(true);
  };

  return (
    <div className="app-container">
      <Nav onOpenModal={handleOpenModal} />
      <Routes>
        <Route path="/" element={<Home onOpenModal={handleOpenModal} />} />

        <Route
          path="/userHome"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-manual"
          element={
            <ProtectedRoute>
              <QuizManual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-generation"
          element={
            <ProtectedRoute>
              <QuizAI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/join/:id"
          element={<PublicQuiz />} // Public route, no authentication
        />
        <Route
          path="/quiz/edit/:id"
          element={
            <ProtectedRoute>
              <EditQuiz />
            </ProtectedRoute>
          }
        />
      </Routes>

      <LoginRegisterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={authMode}
        onSwitchMode={handleOpenModal}
      />
    </div>
  );
}

// Wrap App with AuthProvider here
export default function AppWithAuthProvider() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}
