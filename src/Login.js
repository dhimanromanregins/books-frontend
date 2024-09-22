import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import '../src/App.css'; // Adjust the path if needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        await auth.signOut(); // Sign out if not verified
        return;
      }

      // Navigate to the dashboard or another page
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome back,Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className='margin-space' >
            <label>Email:</label>
            <br></br>
            <input
              type="email"
              placeholder="You @email.com "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <br></br>
            <input
              type="password"
              placeholder=" Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="full-width-button">Login</button>

        </form>
        <p>Don't have an account? <Link className='link-color' to="/register">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;
