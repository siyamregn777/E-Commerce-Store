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
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
        return;
      }

      if (session) {
        const { user } = session;
        setUser({
          userId: user.id, // Supabase user ID
          username: user.user_metadata?.username || null, // Extract username from metadata
          email: user.email || null, // Handle undefined case
          isAuthenticated: true,
          role: user.user_metadata?.role || null, // Extract role from metadata
        });
      } else {
        setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
      }
    };

    fetchSession();

    // Listen for auth state changes (e.g., login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const { user } = session;
        setUser({
          userId: user.id,
          username: user.user_metadata?.username || null,
          email: user.email || null, // Handle undefined case
          isAuthenticated: true,
          role: user.user_metadata?.role || null,
        });
      } else {
        setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Logout function to clear user state and session
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
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









// // userContext.tsx
// 'use client';
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import jwt from 'jsonwebtoken';

// // Define the structure of the decoded token
// interface DecodedToken {
//   userId: string; // Add userId to the token structure
//   username: string; // Add username to the token structure
//   email: string;
//   role: string;
//   exp: number;
// }

// // Define the structure of the user state
// interface User {
//   userId: string | null; // Add userId to the user state
//   username: string | null; // Add username to the user state
//   email: string | null;
//   isAuthenticated: boolean;
//   role: string | null;
// }

// // Define the context properties
// interface UserContextProps {
//   user: User;
//   setUser: React.Dispatch<React.SetStateAction<User>>;
//   logout: () => void; // Logout function
// }

// // Create the UserContext
// const UserContext = createContext<UserContextProps | undefined>(undefined);

// // UserProvider component to wrap your application
// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User>({
//     userId: null, // Initialize userId
//     username: null, // Initialize username
//     email: null,
//     isAuthenticated: false,
//     role: null,
//   });

//   // Effect to check for a token on initial load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwt.decode(token) as DecodedToken | null;
//         if (decoded) {
//           const isExpired = decoded.exp && Date.now() >= decoded.exp * 1000;
//           if (!isExpired) {
//             setUser({
//               userId: decoded.userId, // Extract userId from token
//               username: decoded.username, // Extract username from token
//               email: decoded.email,
//               isAuthenticated: true,
//               role: decoded.role,
//             });
//             return;
//           }
//         }
//       } catch (err) {
//         console.error('Error decoding token:', err);
//       }
//     }
//     // Reset state if token is invalid or expired
//     setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
//   }, []);

//   // Logout function to clear user state and token
//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook to use the UserContext
// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };