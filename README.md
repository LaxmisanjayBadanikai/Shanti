# PeaceOS - AI-Powered Community Coordination Platform

<div align="center">
  
**Peace, Pluralism & Human Dignity • AI-Powered Crisis & Community Coordination System**

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.15.0-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.4.0-4285F4?logo=google)](https://ai.google.dev/gemini-api)

</div>

## 📖 Overview

**PeaceOS** is a comprehensive emergency response and community coordination platform built for the **"SHANTI"** vision — a secure, dignified, and pluralistic society. It enables real-time collaboration between citizens, police, hospitals, NGOs, district administration, and volunteers during festivals, events, and emergencies.

### 🌟 Core Vision: SHANTI

> **S**ecurity • **H**armony • **A**wareness • **N**etworked • **T**ransparent • **I**ntegrity

The platform embodies peace, pluralism, and human dignity through AI-powered incident management, resource coordination, and multi-stakeholder communication.

---

## 🚀 Key Features

### 🏠 Role-Based Dashboards

| Role | Dashboard | Key Capabilities |
|------|-----------|------------------|
| **Citizen** | SOS Beacon, Safety Alerts | Trigger emergencies, view incidents, find safe routes |
| **Police** | Dispatch Center | Manage traffic, coordinate crowd control, update incident status |
| **District Admin** | Command Center | AI-generated SITREPs, broadcast notifications, resource management |
| **NGO** | Relief Coordination | Shelter management, volunteer task assignment, aid distribution |
| **Hospital** | Emergency Triage | Bed management, ambulance tracking, medical emergency response |
| **Volunteer** | Task Portal | Accept community tasks, check-in, log completions |

### 🤖 AI-Powered Intelligence

- **Gemini 3.5 Flash Integration**: Real-time incident analysis and summarization
- **Duplicate Detection**: Prevents redundant reporting with AI matching
- **Multilingual Translation**: Instant translation into Hindi, Marathi, Gujarati, Urdu
- **Priority Scoring**: 0-100 urgency scoring with justification
- **Intelligent SITREP Generation**: Automated district situation reports
- **Smart Notification Suggestions**: AI-generated public advisories

### 🗺️ Interactive Map Features

- **Live Incident Visualization**: Real-time incident pins with severity indicators
- **Shelter Locations**: Available relief centers with capacity tracking
- **AI Heatmap**: Crowd density visualization for congested areas
- **Route Navigation**: Dynamic routing to incident locations
- **Multiple Map Modes**: Standard, Satellite, and AI Heatmap views

### 📱 Mobile-Ready Architecture

- **Flutter Codebase**: Full mobile source code included for iOS/Android deployment
- **Responsive Design**: Optimized for desktop, tablet, and mobile views
- **Bottom Navigation**: Mobile-first navigation pattern
- **PWA Capabilities**: Progressive Web App ready

### 🔐 Security & Authentication

- **Multi-Factor Authentication**: Email, Phone (OTP), and Google Sign-In
- **Role-Based Access Control**: Granular permissions per user role
- **Secure Firebase Integration**: Cloud Firestore for data persistence
- **Session Management**: Persistent login with secure logout

---

## 📂 Project Structure

```

peaceos/
├── src/
│   ├── components/
│   │   ├── DashboardViews.tsx     # 6 role-specific dashboards
│   │   ├── IncidentMap.tsx        # Interactive map with routing
│   │   ├── IncidentDetails.tsx    # Incident management UI
│   │   ├── ReportIncident.tsx     # Incident reporting with AI validation
│   │   ├── NotificationsScreen.tsx # Broadcast & alert center
│   │   ├── ProfileScreen.tsx      # User profile & role switching
│   │   ├── Login.tsx              # Multi-auth login page
│   │   ├── Splash.tsx             # Loading splash screen
│   │   └── FlutterCodebase.tsx    # Mobile code preview
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles & Tailwind
│   ├── types.ts                   # TypeScript interfaces
│   ├── mockData.ts               # Sample data for testing
│   └── firebase.ts               # Firebase configuration
├── server.ts                      # Express + Gemini API routes
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
└── .env.example                   # Environment variables template

```

---

## 🛠️ Technology Stack

### Frontend
- **React 19** with Hooks and Context API
- **TypeScript** for type safety
- **Tailwind CSS 4** for utility-first styling
- **Motion** for smooth animations
- **Lucide React** for iconography

### Backend
- **Express.js** server with Vite middleware
- **Google Gemini 3.5 Flash** for AI intelligence
- **Firebase** for authentication and database
- **Node.js** runtime

### Mobile (Flutter)
- **Flutter** for cross-platform mobile apps
- **Firebase Core** for cloud sync
- **Google Maps Flutter** for mobile map integration
- **Clean Architecture** patterns

### DevOps
- **Vite** for fast build and development
- **Docker** ready (via environment variables)
- **Cloud Run** deployment support
- **Environment Variables** for secure configuration

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://ai.google.dev/gemini-api))
- (Optional) Firebase account for production deployment

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/peaceos.git
cd peaceos
```

1. **Install dependencies**

```
npm install
```

1. **Configure environment variables**

```
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
```

1. **Run the development server**

```
npm run dev
```

1. **Open your browser** at `http://localhost:3000`

## 🧪 Testing the Platform

### Login Credentials (Demo)

Use these pre-configured accounts to test different roles:

| Role | Email | Password (any) |
|---|---|---|
| District Admin | `admin@shanti.gov` | `password` |
| Police | `rajesh.police@shanti.gov` | `password` |
| Hospital | `meera.alvi@cityhospital.org` | `password` |
| NGO | `siddharth@peacefoundation.org` | `password` |
| Volunteer | `kabir.v@shanti.org` | `password` |
| Citizen | `ananya@gmail.com` | `password` |

### Quick Test Scenarios

1. **Trigger an SOS Alert** (Citizen view) → Click the red SOS button
1. **Generate an AI SITREP** (Admin view) → Click "Compile Sitrep"
1. **Report an Incident** → Fill the form and click "Check with Gemini AI"
1. **Update Incident Status** (Police/Admin) → Click status buttons
1. **Broadcast Notifications** (Admin) → Generate AI suggestions and broadcast

## 📊 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/gemini/summarize-incident` | POST | AI incident analysis & scoring |
| `/api/gemini/detect-duplicate` | POST | Check for duplicate reports |
| `/api/gemini/translate` | POST | Multilingual translation |
| `/api/gemini/situation-report` | POST | Generate AI SITREP |
| `/api/gemini/notification-suggestions` | POST | AI broadcast recommendations |

## 🚢 Deployment

### To Google Cloud Run (AI Studio)

1. Fork/deploy via **Google AI Studio**
1. Set the `GEMINI_API_KEY` in the Secrets panel
1. The platform auto-deploys to a Cloud Run URL

### To Vercel / Netlify

```
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### To Docker

```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
COPY server.ts ./
CMD ["node", "server.ts"]
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
1. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
1. **Commit your changes** (`git commit -m 'Add amazing feature'`)
1. **Push to the branch** (`git push origin feature/amazing-feature`)
1. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new files
- Follow the existing component structure
- Run `npm run lint` before committing
- Add tests for new features (coming soon)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://LICENSE) file for details.

## 🙏 Acknowledgements

- Built with ❤️ for the **SHANTI** vision: Peace, Pluralism & Human Dignity
- Powered by [Google Gemini](https://ai.google.dev/gemini-api) AI
- Inspired by the need for **collaborative community safety**
- Special thanks to all first responders, volunteers, and citizens who make communities safe
<div align="center">
**PeaceOS — Coordinating Peace, One Incident at a Time** 🕊️
</div>
