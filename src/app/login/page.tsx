"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import './login.css'

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      const data = await response.json();
      const { token, role, userId, email } = data;

      // Save the token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email || '');

      // Update user context
      setUser({
        userId,
        username,
        email,
        isAuthenticated: true,
        role,
      });

      console.log('Login successful, redirecting...');
      setUsername('');
      setPassword('');

      // Redirect based on the role (admin or user)
      if (role === 'admin') {
        router.push('/adminDashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during login.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h1 className="title">Login</h1>
      <form onSubmit={handleSubmit} className="loginContainer">
        <input
          type="text" // Use text input type for username
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username" // Change placeholder to "Username"
          required
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input"
        />
        {error && <p className="error" aria-live="assertive">{error}</p>}
        <ul>
          <li>
            <button type="submit" className="createAccountLink" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </li>
          <li className="donot">
            <h5>Don’t have an account?</h5>
            <Link href="/signup" className="signup">
              <span>Create Account</span>
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}
