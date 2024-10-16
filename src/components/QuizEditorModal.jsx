import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Loader from './Loader';
import ConfirmationBox from './ConfirmationBox';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const QuizEditor = ({ saveQuiz, quizData, isLoading, isError, handleClose }) => {
  const [questions, setQuestions] = useState(Array.isArray(quizData) ? quizData : []);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [questionToRemove, setQuestionToRemove] = useState(null);
  const [visibleQuestionId, setVisibleQuestionId] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectOption, setNewCorrectOption] = useState(0);

  useEffect(() => {
    if (Array.isArray(quizData)) {
      setQuestions(quizData);
    }
  }, [quizData]);

  const handleAddQuestion = () => {
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        questionText: newText,
        options: newOptions,
        correctOption: newCorrectOption
      }
    ]);
    // Reset new question states
    setNewText('');
    setNewOptions(['', '', '', '']);
    setNewCorrectOption(0);
    setShowQuestionModal(false);
  };

 
  const handleQuestionChange = (index, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = prevQuestions.map((question, qIndex) => 
        qIndex === index
          ? { ...question, questionText: value }
          : question
      );
      return updatedQuestions;
    });
  };
  

  const handleOptionChange = (qIndex, oIndex, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = prevQuestions.map((question, index) => 
        index === qIndex
          ? {
              ...question,
              options: question.options.map((option, i) => 
                i === oIndex ? value : option
              )
            }
          : question
      );
      return updatedQuestions;
    });
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = prevQuestions.map((question, index) => 
        index === qIndex
          ? { ...question, correctOption: value }
          : question
      );
      return updatedQuestions;
    });
  };

  const handleRemoveQuestion = (index) => {
    setQuestionToRemove(index);
    setShowRemoveConfirmation(true);
  };

  const confirmRemoveQuestion = () => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== questionToRemove);
    setQuestions(updatedQuestions);
    setShowRemoveConfirmation(false);
  };

  const handleSave = () => {
    setShowSaveConfirmation(true);
  };

  const confirmSave = () => {
    saveQuiz(questions);
    setShowSaveConfirmation(false);
  };

  const handleCancel = () => {
    setQuestions([]);
    handleClose();
  };

  const toggleQuestionVisibility = (id) => {
    setVisibleQuestionId(visibleQuestionId === id ? null : id);
  };


  const handleNewQuestion = (value) => {
    setNewText(value);
  };

  const handleNewOptions = (index, value) => {
    setNewOptions(prevOptions => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = value;
      return updatedOptions;
    });
  };

  const handleNewCorrectOption = (value) => {
    setNewCorrectOption(value);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center position-fixed w-100 h-100"
      style={{
        top: 0,
        left: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        className="p-4 bg-white"
        style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          minWidth: '1200px',
          minHeight: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h2 className="d-flex justify-content-center mb-2">Manage Quiz</h2>
        {isLoading && <Loader />}
        {isError && questions.length==0 && <h4 className="text-danger">No Quiz available..!</h4>}
        {Array.isArray(questions) &&
          questions.map((question, qIndex) => (
            <div
              key={question._id}
              className="mb-2 bg-light"
              style={{ border: '1px solid #ddd', borderRadius: '10px' }}
            >
              <div className="d-flex justify-content-between align-items-center p-2">
                <h4>
                  Q {qIndex + 1}. {question.questionText || 'New Question'}?
                </h4>
                <Button
                  variant="link"
                  onClick={() => toggleQuestionVisibility(question._id)}
                  style={{ textDecoration: 'none' }}
                >
                  {visibleQuestionId === question._id ? (
                    <FaChevronUp size={24} />
                  ) : (
                    <FaChevronDown size={24} />
                  )}
                </Button>
              </div>

              {visibleQuestionId === question._id && (
                <div className="quiz-questions p-4">
                  <Form.Group controlId={`question-${qIndex}`}>
                    <Form.Control
                      type="text"
                      placeholder="Enter the question"
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    />
                  </Form.Group>
                  <Row>
                    {question.options.map((option, oIndex) => (
                      <Col key={oIndex} md={6}>
                        <Form.Group controlId={`option-${qIndex}-${oIndex}`}>
                          <Form.Label>Option {oIndex + 1}</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter the option"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>
                  <Form.Group controlId={`correctOption-${qIndex}`}>
                    <Form.Label>Correct Option</Form.Label>
                    <Form.Control
                      as="select"
                      value={question.correctOption}
                      onChange={(e) => handleCorrectOptionChange(qIndex, parseInt(e.target.value))}
                    >
                      {question.options.map((_, oIndex) => (
                        <option key={oIndex} value={oIndex}>
                          Option {oIndex + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button
                    className="d-flex m-auto mt-2"
                    variant="danger"
                    onClick={() => handleRemoveQuestion(qIndex)}
                  >
                    Remove Question
                  </Button>
                </div>
              )}
            </div>
          ))}
        <Button variant="primary" onClick={() => setShowQuestionModal(true)}>
          Add Question
        </Button>
        <div className="m-2 d-flex justify-content-center">
          <Button variant="primary" className="me-2" onClick={handleSave}>
            Apply Changes
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
        <ConfirmationBox
          show={showRemoveConfirmation}
          handleClose={() => setShowRemoveConfirmation(false)}
          handleConfirm={confirmRemoveQuestion}
          title="Remove Quiz Question"
          message="Are you sure you want to remove this question? "
        />
        <ConfirmationBox
          show={showSaveConfirmation}
          handleClose={() => setShowSaveConfirmation(false)}
          handleConfirm={confirmSave}
          title="Save Quiz"
          message="Are you sure you want to save the changes to the quiz?"
        />
        <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="questionText">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the question"
                value={newText}
                onChange={(e) => handleNewQuestion(e.target.value)}
              />
            </Form.Group>
            {newOptions.map((option, index) => (
              <Form.Group key={index} controlId={`option-${index}`}>
                <Form.Label>Option {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the option"
                  value={option}
                  onChange={(e) => handleNewOptions(index, e.target.value)}
                />
              </Form.Group>
            ))}
            <Form.Group controlId="correctOption">
              <Form.Label>Correct Option</Form.Label>
              <Form.Control
                as="select"
                value={newCorrectOption}
                onChange={(e) => handleNewCorrectOption(parseInt(e.target.value))}
              >
                {newOptions.map((_, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddQuestion}>
              Add Question
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

QuizEditor.propTypes = {
  saveQuiz: PropTypes.func.isRequired,
  quizData: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default QuizEditor;
