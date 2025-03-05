import axios from "axios";

const API_URL = "http://localhost:5000";

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
    const res = await axios.post(`${API_URL}/api/quizzes`, quizData, getAuthHeaders()); // Use POST for creating a quiz
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

// Get a specific quiz
export const getQuiz = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/quizzes/${id}`, getAuthHeaders());
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

// Join a quiz by code
export const joinQuiz = async (code) => {
  try {
    const res = await axios.get(`${API_URL}/api/quizzes/join/${code}`);
    return res.data;
  } catch (error) {
    console.error("Error joining quiz:", error);
    throw new Error("Failed to join quiz");
  }
};

// Delete a quiz
export const deleteQuiz = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/api/quizzes/${id}`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new Error("Failed to delete quiz");
  }
};

// Generate a unique join code
// Function to generate a unique join code
export const generateJoinCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

