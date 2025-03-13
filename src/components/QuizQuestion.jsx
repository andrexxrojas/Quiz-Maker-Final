import { useState } from "react"

function QuizQuestion({ question, onUpdate, onRemove }) {
    const [questionText, setQuestionText] = useState(question.text);
    const [options, setOptions] = useState(question.options);

    const handleQuestionChange = (e) => {
        setQuestionText(e.target.value);
        onUpdate({ ...question, text: e.target.value });
    };

    const handleOptionChange = (index, newText) => {
        const updatedOptions = options.map((opt, i) => 
            i === index ? { ...opt, text: newText } : opt
        );
        setOptions(updatedOptions);
        onUpdate({ ...question, options: updatedOptions });
    };

    const toggleCorrectAnswer = (index) => {
        const updatedOptions = options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index ? true : false, // Set only the clicked option as correct
        }));
        
        setOptions(updatedOptions);
        onUpdate({ ...question, options: updatedOptions });
    };

    const addOption = () => {
        if (options.length < 4) {
            const newOption = { id: Date.now(), text: "", isCorrect: false };
            const updatedOptions = [...options, newOption];
            setOptions(updatedOptions);
            onUpdate({ ...question, options: updatedOptions });
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const updatedOptions = options.filter((_, i) => i !== index);
            setOptions(updatedOptions);
            onUpdate({ ...question, options: updatedOptions });
        }
    };

    return(
        <div className="quiz-question-container manual">
            <input 
                className="question-input" 
                type="text" 
                placeholder="Type question here"
                value={questionText}
                onChange={handleQuestionChange}
            />

            <div className="option-container">
                {options.map((option, index) => (
                    <div className="option" key={option.id}>
                        <input
                            type="text"
                            placeholder="Type answer here"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                        <div className="option-choices">
                            <button className="delete-btn" onClick={() => removeOption(index)}>
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                            <button 
                                className={option.isCorrect ? "correct" : ""}
                                onClick={() => toggleCorrectAnswer(index)}
                            >
                                <i className="fa-solid fa-check"></i>
                            </button>
                        </div>

                        {options.length < 4 && (
                            <button className="add-option-btn" onClick={addOption}>+</button>
                        )}
                    </div>
                ))}

            </div>
        </div>
    )
}

export default QuizQuestion;