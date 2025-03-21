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
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
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

// Check if user is logged in
// Check if user is logged in
app.get('/check-login', verifyToken, (req, res) => {
  // If verifyToken allows the request to proceed, the user is logged in
  res.status(200).json({ loggedIn: true, user: req.user });
});

app.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route', user: req.user });
  console.log('Protected route', req.user);
});

app.get('/albums', verifyToken, async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      where: { userId: req.user.userId },
      select: { id: true, name: true, description: true },
    });

    res.status(200).json({ albums });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
);

// Get album by ID route
app.get("/albums/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Query the database for the album by ID
    const album = await prisma.album.findUnique({
      where: {
        id: parseInt(id), // Make sure to convert id to a number
      },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Send the album details as the response
    res.json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ message: "An error occurred while fetching the album" });
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch user by id from the database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },  // Convert id to number
    });

    if (user) {
      res.status(200).json(user);  // Return user data as JSON
    } else {
      res.status(404).json({ error: 'User not found' });  // User not found
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
});




// Backend route for creating an album
app.post('/albums', async (req, res) => {
  const { name, description, categoryId, userId } = req.body;

  try {
    const newAlbum = await prisma.album.create({
      data: {
        name,
        description,
        // categoryId, // SOON TO COME
        userId, // Assuming userId is passed from the client
      },
    });

    res.status(201).json({ message: 'Album created successfully', album: newAlbum });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ message: 'Error creating album', error });
  }
});

// Delete album route
app.delete('/albums/:id/delete', verifyToken, async (req, res) => {
  const albumId = parseInt(req.params.id); // Get album ID from the URL parameter
  const userId = req.user.userId; // Get user ID from the JWT

  try {
    // Find the album to check if it belongs to the logged-in user
    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    if (album.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this album' });
    }

    // Delete the album
    await prisma.album.delete({
      where: { id: albumId },
    });

    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ message: 'Error deleting album', error });
  }
});

// Delete image within an album route
app.delete('/albums/:albumId/images/:imageId', verifyToken, async (req, res) => {
  const albumId = parseInt(req.params.albumId); // Get album ID from the URL parameter
  const imageId = parseInt(req.params.imageId); // Get image ID from the URL parameter
  const userId = req.user.userId; // Get user ID from the JWT

  try {
    // Find the album to check if it belongs to the logged-in user
    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    if (album.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this image' });
    }

    // Find the image in the album
    const image = await prisma.image.findUnique({
      where: { id: imageId, albumId: albumId },
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found in the specified album' });
    }

    // Optionally, you can also delete the image file from storage (if you store files on the server)
    // Example: if you use filesystem storage, you could use fs.unlinkSync() to remove the image from disk.
    // If you're using a cloud service like AWS S3, you would use their SDK to delete the file.
    
    // Delete the image from the database
    await prisma.image.delete({
      where: { id: imageId },
    });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image', error });
  }
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
