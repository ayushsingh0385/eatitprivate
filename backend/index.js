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

// Middleware
const upload = multer({ dest: 'uploads/' });
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));


// CORS configuration
app.use(cors({
  origin: [`${process.env.FRONTEND_URL || 'http://localhost:5173'}`],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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