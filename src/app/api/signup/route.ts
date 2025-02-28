import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabaseClient';  // Use 'supabase' instance

interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { firstName, lastName, username, email, password }: SignupData = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const user = data?.user;
      if (user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              first_name: firstName,
              last_name: lastName,
              username: username,
              email: email,
              user_id: user.id, 
            },
          ]);

        if (insertError) {
          return res.status(500).json({ message: insertError.message });
        }

        return res.status(200).json({ message: 'Signup successful! Please log in.' });
      }

      return res.status(500).json({ message: 'User creation failed.' });
    } catch (err) {
      console.error('Server Error:', err);
      return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
