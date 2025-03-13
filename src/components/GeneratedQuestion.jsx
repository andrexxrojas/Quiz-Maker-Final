import { useState } from "react";

function GeneratedQuestion({
  question = {
    text: "",
    options: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
    ],
  },
  onUpdate = () => {},
}) {
  const handleQuestionChange = (e) => {
    onUpdate({ ...question, text: e.target.value });
  };

  const handleOptionChange = (index, newText) => {
    const updatedQuestion = {
      ...question,
      options: question.options.map((opt, i) =>
        i === index ? { ...opt, text: newText } : opt
      ),
    };
    onUpdate(updatedQuestion);
  };

  const toggleCorrectAnswer = (index) => {
    const updatedQuestion = {
      ...question,
      options: question.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      })),
    };
    onUpdate(updatedQuestion);
  };

  const addOption = () => {
    if (question.options.length < 4) {
      const newOption = {
        id: Date.now(),
        text: "",
        isCorrect: false,
      };
      onUpdate({
        ...question,
        options: [...question.options, newOption],
      });
    }
  };

  const removeOption = (index) => {
    if (question.options.length > 2) {
      const updatedOptions = question.options.filter((_, i) => i !== index);
      onUpdate({ ...question, options: updatedOptions });
    }
  };

  // Ensure options always have an ID
  const safeOptions = question.options.map((opt, index) => ({
    ...opt,
    id: opt.id || index + 1,
  }));

  return (
    <div className="quiz-question-container generated">
      <input
        className="question-input"
        type="text"
        placeholder="Type question here"
        value={question.text}
        onChange={handleQuestionChange}
      />

      <div className="option-container">
        {safeOptions.map((option, index) => (
          <div className="option" key={option.id}>
            <input
              type="text"
              placeholder="Type answer here"
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            <div className="option-choices">
              <button
                className="delete-btn"
                onClick={() => removeOption(index)}
                disabled={safeOptions.length <= 2}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
              <button
                className={option.isCorrect ? "correct" : ""}
                onClick={() => toggleCorrectAnswer(index)}
              >
                <i className="fa-solid fa-check"></i>
              </button>
            </div>

            {safeOptions.length < 4 && (
              <button onClick={addOption} className="add-option-btn">
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GeneratedQuestion;
