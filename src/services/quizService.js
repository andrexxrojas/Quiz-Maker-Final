// import { useBridge } from "@react-three/fiber/dist/declarations/src/core/utils";
import axios from "axios";

// const API_URL = "http://localhost:5000";
const API_URL = "https://quiz-maker-final.vercel.app";


// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper function to get headers with token
const getAuthHeaders = () => {
  const token = getToken(); // Reusing the token retrieval
  return token ? { headers: { "x-auth-token": token } } : {}; // Avoid empty token header if no token
};

// Create a new quiz
export const createQuiz = async (quizData) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/quizzes`,
      quizData,
      getAuthHeaders()
    ); // Use POST for creating a quiz
    return res.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Failed to create quiz");
  }
};

// Get all quizzes for the current user
export const getUserQuizzes = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/quizzes`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error fetching user quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  }
};

// Get scores
export const getQuizScores = async (quizId) => {
  try {
    const res = await axios.get(`${API_URL}/api/quizzes/get-score/${quizId}`)
    return res.data;
  } catch (error) {
    console.error("Error fetching quiz scores:", error.message)
    throw new Error("Failed to fetch quiz scores")
  }
}

// Get specific user details
export const getSpecificUser = async(userId) => {
  try {
    const res = await axios.get(`${API_URL}/api/auth/user/${userId}`)
    return res.data
  } catch (error) {
    console.error("Error fetching specific user:", error.message)
    throw new Error("Failed to fetch specific user")
  }
}

// Get user details
export const getUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/auth/user`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error getting user details:", error);
    throw new Error("Failed to fetch user details");
  }
};

export const submitQuiz = async (quizData) => {
  try {
    console.log("Submitting quiz data:", quizData); // Debugging log
    const res = await axios.post(
      `${API_URL}/api/quizzes/submit-score`,
      quizData,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    console.error("Error submitting score:", error.response?.data || error);
    throw new Error("Failed to submit score");
  }
};

// Join a quiz by code
export const joinQuiz = async (code) => {
  try {
    if (!code) {
      throw new Error("Quiz code is required");
    }

    const res = await axios.get(`${API_URL}/api/quizzes/join/${code}`);
    return res.data;
  } catch (error) {
    console.error("Error joining quis:", error);
    throw new Error("Failed to join quiz");
  }
};

// Get a specific quiz
export const getQuiz = async (id) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/quizzes/${id}`,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    console.error("Detailed error in getQuiz:", error);

    // If there's a response from the server, throw its message
    if (error.response) {
      console.error("Server response error:", error.response.data);
      throw error.response.data;
    }

    // If no server response, throw a generic error
    throw new Error("Failed to fetch quiz. Please try again.");
  }
};

// Delete a quiz
export const deleteQuiz = async (id) => {
  try {
    const res = await axios.delete(
      `${API_URL}/api/quizzes/${id}`,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new Error("Failed to delete quiz");
  }
};

// Generate a quiz using AI
export const generateQuizAI = async (prompt) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/generate-quiz`, // Correct AI quiz generation endpoint
      { prompt }, // Send prompt in request body
      getAuthHeaders() // Include token if needed
    );
    return res.data;
  } catch (error) {
    console.error("Error generating AI quiz:", error);
    throw new Error("Failed to generate AI quiz");
  }
};

// Edit an existing quiz
export const editQuiz = async (id, quizData) => {
  try {
    const res = await axios.put(
      `${API_URL}/api/quizzes/${id}`,
      quizData,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw new Error("Failed to update quiz");
  }
};

// Generate a unique join code
export const generateJoinCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
