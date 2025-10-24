# Real-Time Voting App

A modern, real-time voting application built with React, Node.js, and WebSockets. Features beautiful UI components, live vote updates, interactive charts, and comprehensive user management.

## 🚀 Live Demo

[https://real-time-voting-app-beta.vercel.app/](https://real-time-voting-app-beta.vercel.app/)

## ✨ Features

### 🎨 Modern UI/UX
- **Beautiful Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme switching with CSS variables
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Gradient Backgrounds**: Eye-catching gradient backgrounds and glassmorphism effects

### 🔄 Real-Time Updates
- **WebSocket Integration**: Live vote updates using Socket.io
- **Instant Notifications**: Real-time notifications when users vote
- **Auto-refresh**: Results update automatically without page refresh
- **Connection Status**: Visual indicators for connection status

### 📊 Data Visualization
- **Interactive Charts**: Bar charts and pie charts using Recharts
- **Live Statistics**: Real-time vote counts and percentages
- **Progress Bars**: Animated progress bars showing vote distribution
- **Leading Indicators**: Visual indicators for leading options

### 👤 User Management
- **Simple Authentication**: Name-based login system
- **Session Management**: JWT-based session handling
- **User Profiles**: Personal voting statistics and history
- **Vote History**: Track user's voting history and patterns

### 🚀 Additional Features
- **Vote Prevention**: Prevents duplicate voting per user
- **Loading States**: Beautiful loading animations and states
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Mobile Optimized**: Touch-friendly interface for mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing (for future use)

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Framer Motion** - Animation library
- **Recharts** - Chart library
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication

## 📂 Project Structure

```
/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api/
    │   └── App.jsx
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Real-Time-Voting-App
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   DB_CONNECT=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

5. **Start MongoDB**
   - Local: Make sure MongoDB is running on your system
   - Cloud: Update the `DB_CONNECT` in your `.env` file

6. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 Usage

### For Voters
1. **Login**: Enter your name to access the voting system.
2. **Vote**: Choose from the available options (Option A, B, or C). You can only vote once.
3. **View Results**: See real-time results with interactive charts on the voting page.
4. **Full Results Page**: Navigate to the results page to see more detailed statistics and charts.
5. **Track History**: View your voting history in your profile.

## 🎯 Key Components

### Backend API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/vote` - Cast a vote
- `GET /api/vote/results` - Get aggregated results
- `GET /api/vote/history` - Get user's vote history
- `GET /api/vote` - Get all votes (authenticated)

### Frontend Pages
- **Login Page**: Beautiful authentication interface.
- **Voting Page**: Main voting interface with real-time updates and a summary of results.
- **Results Page**: Comprehensive results with charts and statistics.

### Real-Time Events
- `voteUpdate` - Broadcasts updated vote counts to all clients.
- `newVote` - Notifies all clients when a new vote is cast.


## ✨ Show Your Support

Give a ⭐️ if this project helped you!

## 🙋‍♂️ Author

**Simerdeep Singh Gandhi**

- Portfolio: [https://simerdeep-portfolio.vercel.app/](https://simerdeep-portfolio.vercel.app/)
- GitHub: [@SimerdeepSingh4](https://github.com/SimerdeepSingh4)
- LinkedIn: [Simerdeep Singh Gandhi](https://www.linkedin.com/in/simerdeep-singh-gandhi-5569a7279/)
