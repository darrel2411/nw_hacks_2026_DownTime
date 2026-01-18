# DownTime 🌙

**One-Sentence Pitch:** DownTime helps your brain power down, not just your body.

## 🧠 Problem

Most sleep apps focus on *when* you sleep. But many people aren't kept awake by their bodies — they're kept awake by their thoughts.

At night, the mind:
- Replays conversations
- Worries about tomorrow
- Fixates on unfinished tasks

This mental noise leads to stress, rumination, and delayed sleep — even when the body is tired.

## 💡 Solution

DownTime is a bedtime companion designed to help users mentally shut down before sleep. Instead of tracking sleep scores or wearables, DownTime focuses on the real blocker to rest: **unprocessed thoughts and emotional overload**.

## ✨ Core Features (Hackathon MVP)

### 1️⃣ Bedtime Brain Dump (1–3 minutes)
Users quickly write a few sentences about:
- What's bothering them
- What feels unfinished
- What their mind keeps looping on

No long journaling. No prompts to perform. Just unloading.

### 2️⃣ AI-Powered Mental Closure
DownTime uses AI to:
- Identify emotional tone (stress, anxiety, anticipation, etc.)
- Summarize key worries
- Generate a calm, reassuring closure message

**Example:** *"You've done enough for today. These thoughts can wait until tomorrow."*

This gives the brain explicit permission to stop processing.

### 3️⃣ Night-Mode Transition
After closure:
- The screen shifts to a low-stimulus night UI
- A gentle calming tip appears
- No notifications, streaks, or scores

The goal is down-regulation, not optimization.

### 4️⃣ Weekly Reflection
- AI-generated insights based on your week's mood patterns
- Gentle, non-judgmental observations
- Simple action suggestions for better rest

## 🧩 Why This Works

- Inspired by **cognitive offloading** & **CBT principles**
- Reduces rumination and sleep-onset anxiety
- Creates a psychological "end-of-day" ritual

## 🎯 Target Users

- Overthinkers
- High-stress professionals
- Students and parents
- Anyone whose brain won't "shut off" at night

---

## 🛠️ Tech Stack

### Frontend
- **React Native** (0.81.5) with **Expo** (~54.0.31)
- **Expo Router** (~6.0.21) - File-based routing
- **TypeScript** (~5.9.2) - Type safety
- **Expo Image** - Optimized image loading
- **Expo Secure Store** - Secure token storage
- **React Navigation** - Navigation library

### Backend
- **Node.js** with **Express** (^5.2.1) - REST API server
- **Prisma** (^6.19.2) - ORM
- **PostgreSQL** - Database
- **JSON Web Tokens (JWT)** - Authentication
- **OpenAI API** - AI-powered mood tips and insights

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart for backend
- **TypeScript** - Type checking

---

## 📱 App Flow

1. **Welcome Page** → Initial onboarding screen
2. **Login/Signup** → Email/password authentication
3. **Mood Check-in** → Select mood (Great, Okay, Meh, Sad, Stressed, Tired) + write thoughts
4. **Today's Tip** → View AI-generated calming tip based on your check-in
5. **Weekly Reflection** → View AI-generated insights from your week's mood patterns

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Expo CLI (`npm install -g expo-cli`)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/darrel241/nw_hacks_2026_DownTime.git
   cd nw_hacks_2026_DownTime
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/downtime"
   JWT_SECRET="your-secret-key-here"
   OPENAI_API_KEY="your-openai-api-key"
   PORT=3001
   ```
   
   Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
   
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   
   Create a `.env` file in the `frontend` directory:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3001
   EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key
   ```
   
   Start the Expo development server:
   ```bash
   npm start
   ```

### Running the App

- **iOS**: Press `i` in the Expo CLI or scan QR code with Expo Go app
- **Android**: Press `a` in the Expo CLI or scan QR code with Expo Go app
- **Web**: Press `w` in the Expo CLI

---

## 📁 Project Structure

```
nw_hacks_2026_DownTime/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── routes/
│   │   ├── health.js        # Health check endpoint
│   │   ├── moods.js         # Mood check-in & reflection endpoints
│   │   └── users.js         # User authentication endpoints
│   └── server.js            # Express server setup
│
└── frontend/
    ├── app/
    │   ├── _layout.tsx      # Root layout with navigation
    │   ├── index.tsx        # Redirects to welcome page
    │   ├── welcome.tsx      # Welcome/onboarding screen
    │   ├── login.tsx        # Login screen
    │   ├── signup.tsx       # Signup screen
    │   ├── mood-checkin.tsx # Mood check-in screen
    │   ├── todays-tip.tsx   # Today's AI-generated tip
    │   └── weekly-reflection.tsx # Weekly insights
    ├── components/          # Reusable React components
    ├── assets/              # Images and static assets
    └── constants/           # App constants and theme
```

---

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Create new user account
- `POST /login` - Authenticate user and get JWT token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

### Moods (Requires Authentication)
- `POST /moods` - Submit mood check-in
- `GET /moods` - Get all user's mood check-ins
- `GET /moods/today` - Get today's mood check-in
- `GET /moods/today-checkin` - Check if user has checked in today
- `GET /moods/weekly-summary` - Get weekly mood breakdown
- `GET /moods/weekly-insight` - Get AI-generated weekly insights

### Reflections (Requires Authentication)
- `POST /reflections` - Save weekly reflection

---

## 🗄️ Database Schema

### User
- `id` (Int, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `resetTokenHash` (String, Optional)
- `resetTokenExpiry` (DateTime, Optional)

### Mood
- `id` (Int, Primary Key)
- `feeling` (String) - Mood label (Great, Okay, Meh, Sad, Stressed, Tired)
- `description` (String, Optional) - User's thoughts
- `tip` (String, Optional) - AI-generated calming tip
- `createdAt` (DateTime)
- `userId` (Int, Foreign Key)

### Reflection
- `id` (Int, Primary Key)
- `aiInsight` (String) - AI-generated weekly insight
- `createdAt` (DateTime)
- `userId` (Int, Foreign Key)

---

## 🔐 Security Features

- **Password Hashing**: Uses `crypto.scryptSync` for secure password storage
- **JWT Authentication**: Token-based authentication with 7-day expiration
- **Secure Token Storage**: Uses Expo Secure Store for mobile, localStorage for web
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: Server-side validation for all endpoints

---

## 🎨 Design Philosophy

- **Calming Color Palette**: Soft lavender-grey backgrounds, gentle gradients
- **Minimal UI**: Focus on content, not distractions
- **Low-Stimulus**: Designed to help users wind down, not stay engaged
- **Accessible**: Clear typography, sufficient contrast, intuitive navigation

---

## 🤝 Contributing

This is a hackathon project built for nwHacks 2026. Contributions and feedback are welcome!

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

Built with ❤️ for nwHacks 2026
