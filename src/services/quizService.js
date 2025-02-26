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
    const res = await axios.post(`${API_URL}/api/quizzes`, quizData, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Failed to create quiz"); // Throw an error to be caught in the component
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
    console.error("Error fetching quiz:", error);
    throw new Error("Failed to fetch quiz");
  }
};

// Join a quiz by code
export const joinQuiz = async (code) => {
  try {
    const res = await axios.get(`${API_URL}/api/quizzes/join/${code}`, getAuthHeaders());
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
