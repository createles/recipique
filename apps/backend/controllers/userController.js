import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const signup = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match"});
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPwd,
      },
    });

    res.status(201).json({message: 'Successfully created new user.'});
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: 'Failed to create new user.'});
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

    if (!user) return res.status(400).json({ message: 'No user found with that username.'});

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Send token to client
      return res.status(200).json({
        message: "Login successful!",
        token: token,
        user: { id: user.id, username: user.username }
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (err) {
    console.log('Error logging in:', err);
    res.status(500).json({ message: 'Failed to log in. Please try again.' });
  }
}