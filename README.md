# Olympus Platform - Educational Ecosystem

Project Olympus is a comprehensive educational technology platform designed to revolutionize the way students learn and educators teach. This full-stack application provides a seamless ecosystem for education management, including tenant management, user authentication, course management, and modern AI-powered learning tools.

## Features

- **Multi-Tenant Architecture**: Supports multiple educational institutions with secure data isolation.
- **Role-Based Access Control**: Comprehensive management of roles including tenant admin, teacher, and student.
- **Authentication**: Secure user signup and login with JWT-based authentication.
- **AI-Powered Learning**:
  - **AI Chat**: Integrated Gemini AI for instant doubt clarification and learning assistance.
  - **Real-time Chat**: WebSocket-based chat functionality for students and teachers.
- **File Management**: Secure upload and management of educational resources.
- **Modern UI/UX**: Clean, responsive user interface built with React and Tailwind CSS.

## Tech Stack

### Frontend
- **React** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **HTML5 Drag & Drop API** - File Management

### Backend
- **Node.js** & **Express.js** - Server Framework
- **TypeScript** - Type Safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password Hashing
- **Gemini AI SDK** - AI Features

## Project Structure

### Backend Structure
```
server/
├── src/
│   ├── modules/          # Application modules (auth, users, tenants, etc.)
│   ├── core/
│   │   ├── config/       # Configuration (database, environment)
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Utility functions (logging, security)
│   ├── server.ts         # Application entry point
│   └── app.ts            # Express app setup
├── package.json          # Backend dependencies
└── tsconfig.json         # TypeScript configuration
```

### Frontend Structure
```
client/
├── src/
│   ├── pages/            # React components for different routes
│   ├── components/       # Reusable UI components
│   ├── core/             # Core application logic (routing, state)
│   ├── services/         # API service calls
│   └── App.tsx           # Main App component
├── package.json          # Frontend dependencies
└── tsconfig.json         # TypeScript configuration
```

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory with the following variables:
   ```env
   PORT=8000
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   JWT_EXPIRES_IN=1d
   GEMINI_API_KEY=<your_gemini_api_key>
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:3000`.

## Usage

### Authentication
- **Signup**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`

### AI Features
- **Ask AI**: `POST /api/ai/chat` (Requires authentication)

### File Uploads
- **Upload**: `POST /api/files/upload`
- **List**: `GET /api/files`
- **Download**: `GET /api/files/:id/download`

## Development

### Backend Commands
```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx ts-node src/core/scripts/seed.ts
```

### Frontend Commands
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

This project is proprietary and developed for educational and commercial purposes.

## Contact

For questions or support, please refer to the project documentation or contact the development team.
