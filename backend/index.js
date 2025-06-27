const express = require('express');
const dotenv = require('dotenv');
const mongoDB = require('./connectDb');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
const path = require('path');
const fs = require('fs');
const userRoute = require('./routes/User.Auth.routes.js');
const userPersonalDetails = require('./routes/User.PersonalDetails.routes.js');
const postRoute = require('./routes/Post.routes.js');
const chatRoutes = require('./routes/chatRoutes');
const jwt = require('jsonwebtoken');
const routes = require('./routes/index.js');
const Information = require('./models/UserInformation.js');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Database connection
mongoDB();

const PORT = process.env.PORT || 3000;

// CORS configuration - should be first
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173', // Always allow localhost for development
      'https://eatit-1.onrender.com' // Explicitly allow your render.com domain
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Middleware
const upload = multer({ dest: 'uploads/' });
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Debug middleware to log cookies
app.use((req, res, next) => {
  console.log('=== REQUEST DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Cookies received:', req.cookies);
  console.log('Raw cookie header:', req.headers.cookie);
  console.log('Origin:', req.headers.origin);
  console.log('Referer:', req.headers.referer);
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  
  // Debug: Check if browser is sending any cookies at all
  console.log('All request headers:');
  Object.keys(req.headers).forEach(key => {
    if (key.toLowerCase().includes('cook') || key.toLowerCase().includes('auth')) {
      console.log(`  ${key}: ${req.headers[key]}`);
    }
  });
  
  console.log('==================');
  next();
});

// API Routes
app.use('/api', routes);
app.use('/chat', chatRoutes);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/profile', userPersonalDetails);
app.use('/api/v1/posts', postRoute);


// Scanning 
app.use(async (req, res, next) => {
  if (req.user) {
    const u = await Information.findOne({ authId: req.user }).lean();
    if (!u) return res.status(404).json({ error: 'User not found' });
    console.log('[Middleware] User profile loaded:', u);
    req.userInfo = {
      fullName:       u.fullName,
      dob:            u.dateOfBirth,
      gender:         u.gender,
      height:         u.heightCm,
      weight:         u.weightKg,
      purpose:        u.purposes,
      allergies:      u.allergies,
      diseases:       u.diseases,
      dietPreference: u.dietPreference,
      documents:      u.documents,
    };
  }
  next();
});


// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});