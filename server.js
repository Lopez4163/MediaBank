import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow cross-origin requests from your frontend and allow cookies
app.use(cookieParser());  // Use cookie-parser middleware
app.use(express.json());

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies
  console.log('verifying token...', token);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded; // Add user data to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = generateToken(newUser);
    console.log('Generated token (signup):', token);


    // Store JWT in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
      maxAge: 3600 * 1000, // 1 hour
      sameSite: 'strict', // Same-site policy for better security
    });

    res.status(201).json({ user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    console.log('Generated token (login):', token);


    // Store JWT in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure it's sent only over HTTPS
      maxAge: 3600 * 1000, // 1 hour
      sameSite: 'strict', // Same-site policy for better security
    });

    res.status(200).json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Protected route example (accessible only with a valid token)
// app.get('/profile', verifyToken, (req, res) => {
//   res.status(200).json({ message: 'Protected route', user: req.user });
// });
app.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route', user: req.user });
  console.log('Protected route', req.user);
});

// Logout route (to clear the cookie)
app.post('/logout', (req, res) => {
  console.log("Logout route hit"); // ✅ Confirm request reached backend

  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.status(200).json({ message: 'Logged out successfully' });

  console.log("Response sent"); // ✅ Confirm response was sent

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
