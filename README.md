# Nutrition Assistant Application->
![Built at Hack36](https://postimage.me/images/2025/04/19/built-at-hack36.png)
## Demo Video 
[Youtube Demo Video](https://youtu.be/Wx9JdofD9Ec) This video demonstrates the key features and functionality of the Nutrition Assistant Application.

## PPT
Access the presentation slides for this project [here](https://docs.google.com/presentation/d/1FGuRA-wZuFcZ5n6YJe-JwzqzvQpaHScsJMOFG_wIq3w/edit?usp=sharing).

## Overview
This is a full-stack nutrition assistant application that helps users identify food items, get nutritional information, chat with a nutrition assistant, and share posts with the community. The application uses AI to analyze food images and provide nutritional data and healthier alternatives.

## Features

### User Authentication
- Sign up, login, and email verification
- Password reset functionality
- Personal profile management

### Food Scanning
- Upload food images or capture them using the device camera
- AI-powered food identification
- Detailed nutritional information display
- Healthier food alternatives suggestions

### Nutrition Chat Assistant
- Real-time chat with an AI nutrition assistant
- Ask health and nutrition questions
- Get personalized nutrition advice
- Support for text formatting and image sharing

### Social Features
- Create and share posts with the community
- Comment and reply system
- Like posts and comments
- User profiles

## Technology Stack

### Frontend
- React 19
- React Router v7
- State Management: Redux Toolkit, Zustand
- UI Components: Ant Design
- Form Handling: React Hook Form with Zod validation
- Styling: TailwindCSS
- Build Tool: Vite

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Authentication: JWT, bcrypt
- File Upload: Multer, Cloudinary
- Email Service: Nodemailer
- AI Integration: Google Gemini AI (@google/genai)

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   GOOGLE_API_KEY=your_google_genai_api_key
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/user/signup` - Register a new user
- `POST /api/v1/user/login` - Login user
- `POST /api/v1/user/verify-email` - Verify user email
- `POST /api/v1/user/forgot-password` - Request password reset
- `POST /api/v1/user/reset-password` - Reset password

### User Profile
- `POST /api/v1/profile` - Create user profile
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update user profile

### Posts
- `POST /api/v1/posts` - Create a new post
- `GET /api/v1/posts` - Get all posts
- `GET /api/v1/posts/:id` - Get a specific post
- `PUT /api/v1/posts/:id` - Update a post
- `DELETE /api/v1/posts/:id` - Delete a post

### Food Identification
- `POST /api/identify` - Identify food from image

### Chat
- `POST /chat` - Send message to nutrition assistant

## Usage

1. **Register and Login**: Create an account and verify your email to access the application.

2. **Complete Profile**: Enter your personal details to personalize your experience.

3. **Scan Food**: Use the Scan feature to upload or capture food images for identification and nutritional analysis.

4. **Chat with Assistant**: Ask nutrition-related questions to get personalized advice.

5. **Share Posts**: Create posts to share with the community.

6. **Interact**: Comment on posts, reply to comments, and like content.

## Made at
This project was created at [hack36.in](https://hack36.in)

## Contributors
- [Akprogrammer-mnnit](https://github.com/Akprogrammer-mnnit)
- [ayushsingh0385](https://github.com/ayushsingh0385) - Ayush Singh
- [Prsahant123kumar](https://github.com/Prsahant123kumar)
- [gyaneshsinghyadav](https://github.com/gyaneshsinghyadav)

## License
ISC

## Author
The project author information can be found in the package.json files.