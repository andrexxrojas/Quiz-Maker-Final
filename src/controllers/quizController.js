// quizController.js
const { generateJoinCode } = require('../utils'); 
const Quiz = require('../models/Quiz'); 

const createQuiz = async (req, res) => {
    try {
        const { title, questions } = req.body;
        
        // Generate a unique join code for the quiz
        const joinCode = generateJoinCode();

        // Create the new quiz object
        const newQuiz = new Quiz({
            title,
            questions,
            joinCode, // Add the generated join code to the quiz
        });

        // Save the quiz to the database
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createQuiz };
