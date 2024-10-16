import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons'; // Attractive icons
import Loader from './Loader';

function QuizBox({ questions, isLoading, isError }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answers, setAnswers] = useState([]); // New state to track answers
  const [isQuizComplete, setIsQuizComplete] = useState(false); // To track if quiz is done

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    const correct = index === currentQuestion.correctOption;
    setIsCorrect(correct);

    // Store the answer in the answers array
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: currentQuestion.questionText, selectedOption: index, isCorrect: correct },
    ]);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizComplete(true); // Mark quiz as complete
    }
  };

  const handlePrevious = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswers = answers.length - correctAnswers;
    return { correctAnswers, incorrectAnswers };
  };

  const resetQuiz = () => {
    // Reset all the states to their initial values
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setAnswers([]);
    setIsQuizComplete(false);
  };

  if (isLoading) return <div><Loader /></div>;
  if (isError) return <div>{isError}</div>;

  if (isQuizComplete) {
    const { correctAnswers, incorrectAnswers } = calculateResults();
    return (
      <div className="bg-light p-4 mt-4 shadow rounded">
        <h2 className="text-center mb-4">Quiz Results</h2>
        <Row className="mb-3">
          <Col>
            <div className="bg-primary text-white p-3 rounded text-center">
              <h4>Total Questions</h4>
              <p className="display-5">{questions.length}</p>
            </div>
          </Col>
          <Col>
            <div className="bg-success text-white p-3 rounded text-center">
              <h4>Correct Answers</h4>
              <p className="display-5">{correctAnswers}</p>
            </div>
          </Col>
          <Col>
            <div className="bg-danger text-white p-3 rounded text-center">
              <h4>Incorrect Answers</h4>
              <p className="display-5">{incorrectAnswers}</p>
            </div>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <Button variant="primary" onClick={resetQuiz} className="px-5 py-2">
            Restart Quiz
          </Button>
        </div>
      </div>
    );
  }
  

  return (
    <div className='bg-light p-3 mt-2 shadow position-relative' style={{ borderRadius: '10px' }}>
      <h2>Quiz</h2>
      <h4>{currentQuestionIndex + 1}. {currentQuestion?.questionText}?</h4>

      {selectedOption !== null && (
        <div className="position-absolute" style={styles.iconContainer}>
          {isCorrect ? (
            <CheckCircleFill color="#28a745" size={40} /> // Attractive green tick
          ) : (
            <XCircleFill color="#dc3545" size={40} /> // Attractive red cross
          )}
        </div>
      )}

      <Row>
        {currentQuestion?.options.map((option, index) => (
          <Col xs={6} key={index} className="mb-3">
            <Button
              style={{
                width: '100%',
                backgroundColor:
                  selectedOption === index
                    ? isCorrect
                      ? '#28a745'
                      : '#dc3545'
                    : '#f0f0f0',
                color: selectedOption === index ? '#fff' : '#000',
              }}
              onClick={() => handleOptionClick(index)}
              disabled={selectedOption !== null} // Disable option buttons once one is selected
            >
              {option}
            </Button>
          </Col>
        ))}
      </Row>

      {selectedOption !== null && !isCorrect && (
        <p style={styles.correctAnswerText}>
          Correct answer: <strong>{currentQuestion.options[currentQuestion.correctOption]}</strong>
        </p>
      )}

      {selectedOption !== null && (
        <p style={styles.feedbackText}>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </p>
      )}

      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={selectedOption === null} // Disable next button until an option is selected
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const styles = {
  iconContainer: {
    top: '10px',
    right: '10px',
    zIndex: 10,
  },
  correctAnswerText: { 
    fontSize: '1.1rem',
    color: '#dc3545',
  },
  feedbackText: { 
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default QuizBox;
