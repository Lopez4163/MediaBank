import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import multer from 'multer';
import fs from 'fs';
import path from 'path';


dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow cross-origin requests from your frontend and allow cookies
app.use(cookieParser());  // Use cookie-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Middleware to extract userId and albumName
// const extractFields = (req, res, next) => {
//   console.log('extractingFields.....', req.body);
//   const { userId, albumName, albumId } = req.body;
  
//   if (!userId || !albumName) {
//     return res.status(400).json({ error: 'Missing userId or albumName' });
//   }
//   req.userId = userId;
//   req.albumName = albumName;
//   req.albumId = albumId;
//   next();
// };



//###################### MULTER MIDDLEWARE #####################
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('mutler storage....')
    const { userId, albumName } = req;
    const uploadPath = path.join(__dirname, `../uploads/${userId}/${albumName}`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage }).fields([
  { name: 'userId', maxCount: 1 },    // Explicitly declare fields
  { name: 'albumName', maxCount: 1 }, // Multer will parse these
  { name: 'image', maxCount: 1 }      // And the file
]);
// const upload = multer({ storage });
//###################################################################

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


// Multer Middleware
// const upload = multer({ storage: storage });

//############ FOR CREATING USER DIRECTORY ############
const ensureUserDirectoryExists = (userId) => {
  try {
    console.log('Ensuring user directory exists:', userId);
    const userDir = path.join(__dirname, `../uploads/${userId}`);
    console.log('User directory:', userDir);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true }); // Create the user directory if it doesn't exist
    }
  } catch (error) {
    console.error('Error ensuring user directory exists:', error);
  }
};
//######################################################



//#################### FOR CREATING ALBUM #######################
const ensureAlbumDirectoryExists = (userId, albumName) => {
  console.log('Ensuring album directory exists:', userId, albumName);
  try {
    console.log(`Ensuring album directory exists for user ${userId}:`, albumName);
    const albumDir = path.join(__dirname, `../uploads/${userId}/${albumName}`);
    
    if (!fs.existsSync(albumDir)) {
      fs.mkdirSync(albumDir, { recursive: true }); // Create the album directory if it doesn't exist
      console.log(`Album directory created: ${albumDir}`);
    }
    return albumDir;
  } catch (error) {
    console.error('Error ensuring album directory exists:', error);
    return null
  }
};
//#################################################################


//################################ FOR UPLOADING IMAGES ############################
const addImageToAlbum = async (userId, albumName, imageFile) => {
  console.log('Adding image to album:', userId, albumName, imageFile);
  try {
    const albumDir = ensureAlbumDirectoryExists(userId, albumName);
    if (!albumDir) throw new Error('Album directory error');

    const fileName = `${Date.now()}-${imageFile.originalname}`;
    const imagePath = path.join(albumDir, fileName);
    
    // Use fs.promises for async operations
    await fs.promises.rename(imageFile.path, imagePath);
    
    // Return relative path for web access
    return `/uploads/${userId}/${albumName}/${fileName}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Clean up temp file if exists
    if (imageFile?.path) fs.unlinkSync(imageFile.path);
    return null;
  }
};
//####################################################################################


// Initialize multer with the storage configuration
// const upload = multer({ storage }).single('image'); // Handle one image file upload



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

    // Create a user directory for storing images
     ensureUserDirectoryExists(newUser.id);

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


// Check if user is logged in
app.get('/check-login', verifyToken, (req, res) => {
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
  const albumName = name
  ensureUserDirectoryExists(userId);
  const albumPath = ensureAlbumDirectoryExists(userId, albumName );

  try {
    const newAlbum = await prisma.album.create({
      data: {
        name,
        description,
        // categoryId, // SOON TO COME
        userId, // Assuming userId is passed from the client
        path: albumPath,
      },
    });


    res.status(201).json({ message: 'Album created successfully', album: newAlbum });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ message: 'Error creating album', error });
  }
});

// Upload image route
app.post('/upload-image', 
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      
      // Fields are now in req.body
      const { userId, albumName } = req.body;
      if (!userId || !albumName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Attach to request for storage config
      req.userId = userId;
      req.albumName = albumName;
      next();
    });
  },
  async (req, res) => {
  console.log('POST /upload-image', req.body); // ✅ Confirm request reached backend

  const { userId, albumName, path } = req.body // Get userId and albumName from the request object

  try {
    // Ensure the album directory exists and get the path
    const albumDir = ensureAlbumDirectoryExists(userId, albumName);

    if (!albumDir) {
      return res.status(500).json({ message: 'Album directory could not be created or found.' });
    }

    const imagePath = addImageToAlbum(userId, albumName, req.file);

    // Find the album ID by album name and userId
    const album = await prisma.album.findUnique({
      where: {
          name: albumName,
          id: parseInt(userId),
        },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found.' });
    }

    // Create a new image record in the database
    const image = await prisma.image.create({
      data: {
        albumId: album.id,   // Use the album's ID
        url: path,       // Store the file path
        description: req.body.description || '',  // Optional description
        path: path,      // Path to the image file
      },
    });

    res.status(200).json({ message: 'Image uploaded successfully!', image: image });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image.' });
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
