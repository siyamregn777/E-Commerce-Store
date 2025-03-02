'use client';

import { useState } from 'react';
import './AccountSettings.css';
import { useUser } from '../../context/userContext'; // Adjust the import path as needed

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { user } = useUser(); // Access the user context

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    try {
      // Use the email from the context
      const email = user.email;

      if (!email) {
        throw new Error('Email is missing. Please log in again.');
      }

      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password.');
      }

      alert(data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Handle the error properly
      if (error instanceof Error) {
        alert(error.message || 'Failed to update password. Please try again.');
      } else {
        alert('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="doma">
      <div className="settingsContainer">
        <h2 className="title">Account Settings</h2>

        {/* Password Change */}
        <div className="section">
          <h3>Password Change</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="saveButton" onClick={handlePasswordChange}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;