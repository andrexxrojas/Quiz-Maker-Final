// App.jsx
import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Nav from "./components/Nav";
import LoginRegisterModal from "./components/LoginRegisterModal";
import ProtectedRoute from "./components/ProtectedRoute"; // Add this import
import { AuthProvider } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import QuizManual from "./pages/QuizManual";
import CreateQuizAI from "./pages/CreateQuizAI";

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
          path="/quizManual"
          element={
            <ProtectedRoute>
              <QuizManual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiznew"
          element={
            <ProtectedRoute>
              <CreateQuizAI />
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