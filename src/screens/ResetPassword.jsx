import React, { useState } from 'react';
import Header from '../components/Header';
import { useResetPasswordMutation } from '../slices/userApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { Button, Form } from 'react-bootstrap';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { token } = useParams(); // Get the token from the URL params

  const validateForm = () => {
    if (
      password &&
      (password.length < 6 ||
        !/\d/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password))
    ) {
      toast.error(
        'Password must be at least 6 characters long and contain at least one number and one special character.'
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
        console.log(token)
      await resetPassword({ token, password }).unwrap();
      toast.success('Password has been reset successfully!');
      navigate('/login'); // Redirect to login page on success
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reset password');
      console.error('Failed to reset password:', err);
    }
  };

  return (
    <div>
      <Header />
      <FormContainer>
        <h2>Reset Password</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='my-2' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Reset Password'}
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
}

export default ResetPassword;
