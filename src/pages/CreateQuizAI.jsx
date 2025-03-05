import { useState } from "react";
import dotenv from "dotenv";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

function QuizAI() {
    const [quizName, setQuizName] = useState("");
    const [formData, setFormData] = useState({
        topic: "",
        subTopic: "",
        grade: "",
        questionType: "Multiple Choice",
        questionStyle: "Direct",
        difficulty: "Easy",
        numQuestions: 5
    })

    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSelection = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        // Check for missing fields
        const missingFields = Object.entries(formData)
            .filter(([key, value]) => value === "" || value === null)
            .map(([key]) => key);
    
        if (missingFields.length > 0) {
            alert(`Please fill out the following fields: ${missingFields.join(", ")}`);
            return;
        }

        const prompt = `
        Generate ${formData.numQuestions} quiz questions on the topic of ${formData.topic} (sub-topic: ${formData.subTopic}), 
        suitable for grade ${formData.grade}. The questions should be of ${formData.difficulty} difficulty and in ${formData.questionStyle} style. 
        The question type should be ${formData.questionType}. Provide the questions and four answer choices, marking the correct answer. 
        `;

        setLoading(true);
        
        try {
            const response = await openai.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "You are an AI that generates educational quizzes in JSON format." },
                           { role: "user", content: prompt }],
                max_tokens: 500,
                temperature: 0.7,
                response_format: "json"
            });

            setGeneratedQuiz(response.choices[0].message.content);

            setGenerated(true);
        } catch (error) {
            console.error("Error generating quiz:", error);
            alert("Failed to generate quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return(
        <div className="quiz-container ai">
            <div className="additional-container">
                <div className="quiz-container-box">
                    <h3>Generate a Quiz</h3>

                    <div className="quiz-generation-details">
                        <div className="single-div">
                            <label htmlFor="">Quiz Topic</label>
                            <input 
                                type="text" 
                                placeholder="Enter quiz topic"
                                value={formData.topic}
                                onChange={(e) => handleSelection("topic", e.target.value)}
                            />
                        </div>

                        <div className="single-div">
                            <label htmlFor="">Sub-topic</label>
                            <input 
                                type="text" 
                                placeholder="Enter sub-topic"
                                value={formData.subTopic}
                                onChange={(e) => handleSelection("subTopic", e.target.value)}
                            />
                        </div>

                        <div className="single-div">
                            <label htmlFor="">Grade Level</label>
                            <input 
                                type="text" 
                                placeholder="Enter grade level (1 - 12)"
                                value={formData.grade}
                                onChange={(e) => handleSelection("grade", e.target.value)}
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
                                    <label htmlFor="">{label}</label>
                                    <div className="multiple-options">
                                        {
                                            options.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleSelection(field, option)}
                                                    className={`option-button ${formData[field] === option ? "selected" : ""}`}
                                                >
                                                    {option}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default QuizAI;