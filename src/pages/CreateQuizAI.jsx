import { useState } from "react";
import { generateQuizAI } from "../services/quizService";

function CreateQuizAI({ setGenerated, setGeneratedQuiz }) {
    const [formData, setFormData] = useState({
        topic: "",
        subTopic: "",
        grade: "",
        questionType: "Multiple Choice",
        questionStyle: "Direct",
        difficulty: "Easy",
        numQuestions: 5
    });

    const [loading, setLoading] = useState(false);
    const [quizGenerated, setQuizGenerated] = useState(false);

    const handleSelection = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);

        const prompt = `Generate a ${formData.difficulty.toLowerCase()}-level quiz with ${formData.numQuestions} ${formData.questionType.toLowerCase()} questions. 
        The quiz should be about "${formData.topic}", specifically focusing on "${formData.subTopic}". 
        The questions should follow a "${formData.questionStyle.toLowerCase()}" style and be suitable for a grade ${formData.grade} student. 
        Each question should have four answer choices, with one correct answer clearly indicated.`;

                
        try {
            const data = await generateQuizAI(prompt); // Assuming this returns a quiz array
    
            if (data && Array.isArray(data.questions)) {
                console.log(data);
                setGeneratedQuiz(data);  // Pass the quiz to QuizAI
                setGenerated(true);  // Indicate that the quiz was successfully generated
                setQuizGenerated(true); // Disable further input
            }
            
        } catch (err) {
            console.error("Error generating quiz:", err);
        }

        setLoading(false);
    };

    return (
        <div className="quiz-container ai">
            <div className="additional-container">
                <div className="quiz-container-box">
                    <h3>Generate a Quiz</h3>

                    <div className="quiz-generation-details">
                        <div className="single-div">
                            <label>Quiz Topic</label>
                            <input
                                type="text"
                                placeholder="Enter quiz topic"
                                value={formData.topic}
                                onChange={(e) => handleSelection("topic", e.target.value)}
                                disabled={quizGenerated}
                            />
                        </div>

                        <div className="single-div">
                            <label>Sub-topic</label>
                            <input
                                type="text"
                                placeholder="Enter sub-topic"
                                value={formData.subTopic}
                                onChange={(e) => handleSelection("subTopic", e.target.value)}
                                disabled={quizGenerated}
                            />
                        </div>

                        <div className="single-div">
                            <label>Grade Level</label>
                            <input
                                type="number"
                                placeholder="Enter grade level (1 - 12)"
                                value={formData.grade}
                                min="1"
                                max="12"
                                onChange={(e) => handleSelection("grade", e.target.value)}
                                disabled={quizGenerated}
                            />
                        </div>

                        {
                            [
                                { label: "Question Type", field: "questionType", options: ["Multiple Choice", "Fill in The Blank", "Mixed"] },
                                { label: "Question Style", field: "questionStyle", options: ["Direct", "Scenario-Based", "Conceptual"] },
                                { label: "Difficulty", field: "difficulty", options: ["Easy", "Medium", "Hard"] },
                                { label: "Number of Questions", field: "numQuestions", options: [5, 10, 15] }
                            ].map(({ label, field, options }) => (
                                <div key={field} className="multiple-div">
                                    <label>{label}</label>
                                    <div className="multiple-options">
                                        {options.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => handleSelection(field, option)}
                                                className={`option-button ${formData[field] === option ? "selected" : ""}`}
                                                disabled={quizGenerated}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <button className="submit-btn" onClick={handleSubmit} disabled={loading || quizGenerated}>
                        {loading ? "Generating..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateQuizAI;
