"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './register.css';
import Link from 'next/link';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('The passwords do not match');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/adminRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin registered successfully!');
        setTimeout(() => {
          router.push('/adminDashboard');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="sign">
      <Link href="/adminDashboard" className="dash">
        Dashboard
      </Link>
      <div className="signupContainer">
        <h1 className="signupTitle">Register Admin</h1>
        <form onSubmit={handleSubmit} className="signupForm">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="formGroup">
            <label htmlFor="firstName" className="label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="lastName" className="label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="input"
            />
          </div>

          <button type="submit" className="button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
