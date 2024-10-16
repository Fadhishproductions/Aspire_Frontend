import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../../components/FormContainer';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useInstructorRegisterMutation } from '../../slices/instructorApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function InstructorRegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility toggle

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useInstructorRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const validateForm = () => {
    if (!name || !email) {
      toast.error("Name and Email are required fields.");
      return false;
    }

    if (!password) {
      toast.error("Password is a required field.");
      return false;
    }

    // Password validation
    if (password.length < 6 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Password must be at least 6 characters long and contain at least one number and one special character.");
      return false;
    }

    // Confirm password check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  return (
    <>
      <FormContainer>
        <h1 className='d-flex justify-content-center align-items-center pb-2' style={{ fontFamily: 'monospace' }}>Aspire</h1>
        <h2>Instructor Sign Up</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='my-2' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <div className="input-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              </div>
          </Form.Group>

          <Form.Group className='my-2' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={toggleConfirmPasswordVisibility}
                style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {isLoading && <Loader />}
          <Button type='submit' variant='primary' className='mt-3'>
            Sign Up
          </Button>

          <Row className='py-3'>
            <Col>
              Already have an instructor account? <Link to='/instructor'>Login</Link>
            </Col>
          </Row>
        </Form>
      </FormContainer>
    </>
  );
}

export default InstructorRegisterScreen;
