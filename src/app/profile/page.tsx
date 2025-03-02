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
        // Fetch user data from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, username, email, image')
          .eq('email', user.email)
          .single();

        if (error) throw error;

        // Update state with fetched data
        setName(`${data.first_name} ${data.last_name}`);
        setUsername(data.username);
        setEmail(data.email);
        setImage(data.image || profilePic); // Use default image if no image is set
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchProfileData();
  }, [user?.email]);


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
        const filePath = `user-profiles/${fileName}`; // Use the dedicated bucket
  
        const { error: uploadError } = await supabase.storage
          .from('user-profiles') // Use the dedicated bucket
          .upload(filePath, file);
  
        if (uploadError) throw uploadError;
  
        // Get the public URL of the uploaded image
        const { data: imageUrl } = supabase.storage
          .from('user-profiles') // Use the dedicated bucket
          .getPublicUrl(filePath);
  
        // Update the user's profile with the new image URL
        const { error: updateError } = await supabase
          .from('users')
          .update({ image: imageUrl.publicUrl })
          .eq('id', user.userId); // Use user ID instead of email
  
        if (updateError) throw updateError;
  
        // Update the image state with the new URL
        setImage(imageUrl.publicUrl);
        alert('Profile image updated successfully!');
      } catch (err) {
        console.error('Error updating profile image:', err);
      }
    }
  };



  // const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];

  //     if (!user?.email) {
  //       console.error('Email is missing. Please log in again.');
  //       return;
  //     }

  //     try {
  //       // Upload the image to Supabase Storage
  //       const fileExt = file.name.split('.').pop();
  //       const fileName = `${user.email}-${Date.now()}.${fileExt}`;
  //       const filePath = `user-profiles/${fileName}`; // Use the dedicated bucket

  //       const { error: uploadError } = await supabase.storage
  //         .from('user-profiles') // Use the dedicated bucket
  //         .upload(filePath, file);

  //       if (uploadError) throw uploadError;

  //       // Get the public URL of the uploaded image
  //       const { data: imageUrl } = supabase.storage
  //         .from('user-profiles') // Use the dedicated bucket
  //         .getPublicUrl(filePath);

  //       // Update the user's profile with the new image URL
  //       const { error: updateError } = await supabase
  //         .from('users')
  //         .update({ image: imageUrl.publicUrl })
  //         .eq('email', user.email);

  //       if (updateError) throw updateError;

  //       // Update the image state with the new URL
  //       setImage(imageUrl.publicUrl);
  //       alert('Profile image updated successfully!');
  //     } catch (err) {
  //       console.error('Error updating profile image:', err);
  //     }
  //   }
  // };

  const handleSaveChanges = async () => {
    if (!user?.email) {
      console.error('Email is missing. Please log in again.');
      return;
    }

    try {
      const [firstName, lastName] = name.split(' ');

      // Update the user's profile data in Supabase
      const { error } = await supabase
        .from('users')
        .update({ first_name: firstName, last_name: lastName, username })
        .eq('email', user.email);

      if (error) throw error;

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="profil">
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