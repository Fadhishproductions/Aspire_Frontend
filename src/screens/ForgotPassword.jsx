import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../slices/userApiSlice'; // Adjust the import path as needed
import Header from '../components/Header';
import FormContainer from '../components/FormContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setEmail('');
      toast.success('A password reset link has been sent to your email.');
    } catch (err) {
      toast.error(err?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <Header />
      <FormContainer>
        <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
          <h2 className="text-center mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
        <ToastContainer />
      </FormContainer>
    </div>
  );
}

export default ForgotPassword;
