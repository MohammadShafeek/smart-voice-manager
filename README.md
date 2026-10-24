# Smart Voice Manager 🎙️

Smart Voice Manager is a full-stack MERN web application for creating, managing, and organizing voice and text notes in one place.

## 🚀 Live Demo

https://smart-voice-manager-frontend.onrender.com/

## 📌 Features

- User Registration and Login
- JWT-based Authentication
- Protected Routes
- Password Reset
- Voice Recording
- Speech-to-Text
- Create Text Notes
- Edit and Delete Notes
- Search Notes
- Organize Notes using Folders
- User Profile and Settings
- Auto-save Settings
- Responsive User Interface

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- React Router
- Context API

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Nodemailer

### Database
- MongoDB

### Tools & Deployment
- Git
- GitHub
- VS Code
- Postman
- Render

## 📂 Project Structure

```text
smart-voice-manager/
│
├── client/
│   └── frontend/
│
├── server/
│   └── backend/
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/MohammadShafeek/smart-voice-manager.git
```

### 2. Open the project

```bash
cd smart-voice-manager
```

### 3. Install Frontend Dependencies

```bash
cd client/frontend
npm install
```

### 4. Install Backend Dependencies

Open another terminal:

```bash
cd server/backend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside:

```text
server/backend/.env
```

Add your required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173
```

### 6. Start the Backend

```bash
cd server/backend
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### 7. Start the Frontend

In another terminal:

```bash
cd client/frontend
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## 🔐 Authentication

The application uses JWT-based authentication to protect user-specific routes and data.

Users can:

- Create an account
- Login securely
- Access protected pages
- Reset their password

## 🎙️ Voice Notes

Users can record voice notes directly from the application.

The application also supports speech-to-text using the browser's speech recognition functionality.

## 📝 Text Notes

Users can:

- Create text notes
- Edit existing notes
- Delete notes
- Search notes
- Organize notes into folders

## ☁️ Deployment

The application is deployed using Render.

**Frontend:**

https://smart-voice-manager-frontend.onrender.com/

**Backend:**

https://smart-voice-manager.onrender.com/

## 👨‍💻 Author

**Mohammad Shafeek**

B.Tech Computer Science & Engineering

GitHub:  
https://github.com/MohammadShafeek

LinkedIn:  
https://www.linkedin.com/in/mohammad-shafeek-b74124339