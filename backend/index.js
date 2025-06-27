const express = require('express');
const dotenv = require('dotenv');
const mongoDB = require('./connectDb');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
const userRoute = require('./routes/User.Auth.routes.js');
const userPersonalDetails = require('./routes/User.PersonalDetails.routes.js');
const postRoute = require('./routes/Post.routes.js');
const chatRoutes = require('./routes/chatRoutes');
const routes = require('./routes/index.js');
const Information = require('./models/UserInformation.js');
const { isAuthenticated } = require('./middlewares/isAuthenticated.js');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Database connection
mongoDB();

const PORT = process.env.PORT || 3000;

// CORS configuration - should be first
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// API Routes
app.use('/api', routes);
app.use('/chat', chatRoutes);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/profile', userPersonalDetails);
app.use('/api/v1/posts', isAuthenticated, postRoute);

// User profile loader - only for authenticated requests
app.use(async (req, res, next) => {
  if (req.user) {
    try {
      const u = await Information.findOne({ authId: req.user }).lean();
      if (!u) return res.status(404).json({ error: 'User not found' });
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
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});