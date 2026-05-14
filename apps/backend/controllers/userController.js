import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const signup = (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return;
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await.prisma.user.create({
      data: {
        username: username,
        password: hashedPwd,
      },
    });
  } catch (err) {
    console.error("Error creating user:", error);
  }
}