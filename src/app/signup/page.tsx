'use client';
import { useState } from "react";
import "./signup.css";
import { useRouter } from "next/navigation";
import { supabase } from '../../../lib/supabaseClient'; // Import the Supabase client
export default function Signup() {
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
    
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
    
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
    
        setError('');
        setSuccess('');
    
        try {
            // Sign up the user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
    
            if (authError) {
                setError(authError.message);
                return;
            }
    
            // Insert user data into the 'users' table
            const { error } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user?.id, // Use the user ID from Supabase Auth
                        first_name: firstName,
                        last_name: lastName,
                        username: username,
                        email: email,
                        password: password, // Note: Hash the password in a real-world scenario
                    },
                ]);
    
            if (error) {
                setError(error.message);
            } else {
                setSuccess("Signup successful! Please log in.");
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="sign">
            <div className="signupContainer">
                <h1 className="signupTitle">Sign Up</h1>
                <form onSubmit={handleSubmit} className="signupForm">
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

                    <div className="formGroup">
                        <label htmlFor="firstName" className="label">First Name</label>
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
                        <label htmlFor="lastName" className="label">Last Name</label>
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
                        <label htmlFor="username" className="label">Username</label>
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
                        <label htmlFor="email" className="label">Email</label>
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
                        <label htmlFor="password" className="label">Password</label>
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
                        <label htmlFor="confirmPassword" className="label">Confirm Password</label>
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

                    <button type="submit" className="button">Sign Up</button>
                </form>
            </div>
        </div>
    );
}