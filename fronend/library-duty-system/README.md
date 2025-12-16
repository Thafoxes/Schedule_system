# Library Duty Assignment System

A React-based web application for managing library duty assignments with a unified login portal featuring a stunning PSP XMB-inspired theme.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)


## ✨ Features

### 🎨 Visual Design
- **PSP XMB Theme**: Inspired by PlayStation Portable's iconic Cross Media Bar interface
- **Dynamic Gradient Backgrounds**: Radial gradient that changes based on selected role
  - 🟢 **Student**: Deep forest green
  - 🔴 **Teacher**: Rich crimson red  
  - 🔵 **Admin**: Ocean blue-green
- **Animated Wave Background**: HTML5 Canvas-based flowing silk ribbons with:
  - Smooth sine wave motion
  - Glowing translucent effects
  - Particle system with mesh connections
  - Responsive to screen size changes
- **Layered Title Design**: "Library Duty" (large) + "Assignment System" (smaller) with 📚 book icon

### 🔐 Authentication
- **Unified Login Page**: Single page with role selection (Student/Teacher/Admin)
- **Student Sign Up**: Registration available exclusively for students
- **Forgot Password**: Password reset functionality for all roles
- **Dynamic Input Focus**: Border colors match the selected role theme

### 📱 Responsive
- **Auto-fit Screen**: Automatically adjusts to different monitor sizes
- **No Scrolling Required**: Compact layout fits entire viewport
- **Dynamic Canvas Resize**: Wave animation adapts to window changes

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd library-duty-system
npm install
```

### Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Select Role**: Click Student, Teacher, or Admin button
2. **Watch Theme Change**: Background gradient and waves adapt to your selection
3. **Login**: Enter email and password
4. **Sign Up** (Students only): Click "Sign Up" to create a new account
5. **Forgot Password**: Click "Forgot Password?" to reset your password

## 📁 Project Structure

```
library-duty-system/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # Styles (themes, responsive design)
│   ├── WaveBackground.js   # Canvas-based XMB wave animation
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **React 18** - UI framework
- **HTML5 Canvas** - Hardware-accelerated wave animations
- **CSS3** - Gradients, transitions, responsive design
- **JavaScript ES6+** - Modern JS features

## 🎬 Wave Animation Technical Details

The XMB-style wave animation uses several key techniques:

```javascript
// Particle wave motion formula
this.y += Math.sin(this.x * 0.01 + this.life * 0.02) * 0.3;

// Silk ribbon wave with layered harmonics
const primaryWave = Math.sin(x * 0.008 + this.offset) * this.amplitude;
const secondaryWave = Math.sin(x * 0.015 - this.secondaryOffset) * (this.amplitude * 0.4);

// Particle mesh connections
if (distance < 100) {
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
}
```

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] JWT authentication
- [ ] Role-based dashboards
- [ ] Duty assignment CRUD operations
- [ ] Schedule management calendar
- [ ] Email notifications




---

<p align="center">Made with ❤️ for library management</p>
