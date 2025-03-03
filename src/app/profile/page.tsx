'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './Profile.css';
import profilePic from '../../../public/home.webp'; // Default profile image
import type { StaticImageData } from 'next/image';
import { useUser } from '../../context/userContext'; // Import useUser hook
import { supabase } from '../../../lib/supabaseClient'; // Import Supabase client

const Profile = () => {
  const { user } = useUser(); // Get the user from context
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<string | StaticImageData>(profilePic);

  // Fetch the user's profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.email) {
        console.error('Email is missing. Please log in again.');
        return;
      }

      try {
        // Fetch user data from the API route
        const response = await fetch(`/api/profile?email=${user.email}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        // Update state with fetched data
        setName(`${data.user.first_name} ${data.user.last_name}`);
        setUsername(data.user.username);
        setEmail(data.user.email);
        setImage(data.user.image || profilePic); // Use default image if no image is set
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchProfileData();
  }, [user?.email]);

  // Handle profile image change
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (!user?.email || !user?.userId) {
        console.error('Email or user ID is missing. Please log in again.');
        return;
      }

      try {
        // Upload the image to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.email}-${Date.now()}.${fileExt}`;
        const filePath = `user-profiles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('user-profiles')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded image
        const { data: imageUrl } = supabase.storage
          .from('user-profiles')
          .getPublicUrl(filePath);

        // Update the user's profile with the new image URL
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            image: imageUrl.publicUrl,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        // Update the image state with the new URL
        setImage(imageUrl.publicUrl);
        alert('Profile image updated successfully!');
      } catch (err) {
        console.error('Error updating profile image:', err);
      }
    }
  };

  // Handle saving profile changes
  const handleSaveChanges = async () => {
    if (!user?.email) {
      console.error('Email is missing. Please log in again.');
      return;
    }
  
    try {
      const [firstName, lastName] = name.split(' ');
  
      // Update the user's profile data via the API route
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName,
          lastName,
          username,
          role: user.role, // Include the user's role
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message);
      }
  
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="profile">
      <div className="profileContainer">
        <h2 className="title">Profile Information</h2>

        {/* Profile Image Upload */}
        <div className="imageContainer">
          <Image src={image} alt="Profile" width={120} height={120} className="profileImage" />
          <input type="file" id="fileInput" className="fileInput" onChange={handleImageChange} />
          <label htmlFor="fileInput" className="uploadButton">Change Photo</label>
        </div>

        {/* Profile Details */}
        <div className="infoContainer">
          <div className="infoItem">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="infoItem">
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="infoItem">
            <label>Email:</label>
            <input type="email" value={email} disabled />
          </div>

          <button className="saveButton" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;