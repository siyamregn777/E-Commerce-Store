'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Import Supabase client

// Define the structure of the user state
interface User {
  userId: string | null; // Supabase user ID
  username: string | null; // Username (if available)
  email: string | null;
  isAuthenticated: boolean;
  role: string | null; // Role (if available)
}

// Define the context properties
interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void; // Logout function
}

// Create the UserContext
const UserContext = createContext<UserContextProps | undefined>(undefined);

// UserProvider component to wrap your application
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    userId: null,
    username: null,
    email: null,
    isAuthenticated: false,
    role: null,
  });

  // Effect to check for a session on initial load
  useEffect(() => {
    const fetchSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();

      if (error || !session?.session?.user?.id) {
        // No session found, clear user state
        setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
        return;
      }

      // Restore user state from session
      setUser({
        userId: session.session.user.id,
        username: session.session.user.email || null,
        email: session.session.user.email || null,
        isAuthenticated: true,
        role: 'admin', // Assuming the user is an admin
      });
    };

    fetchSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        setUser({
          userId: session.user.id,
          username: session.user.email || null,
          email: session.user.email || null,
          isAuthenticated: true,
          role: 'admin', // Assuming the user is an admin
        });
      } else if (event === 'SIGNED_OUT') {
        setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Logout function to clear user state and session
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      // Reset user state
      setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};