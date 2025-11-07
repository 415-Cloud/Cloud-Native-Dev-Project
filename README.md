# Workout App

A modern React Native workout app with a sleek black theme.

## Features

- 🎨 Beautiful black theme with professional design
- 📱 Modern UI components
- 🏋️ Workout browsing and details
- 📊 Exercise tracking with sets, reps, and rest periods
- 🧭 Easy navigation between screens

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (ships with recent Node releases)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator (Windows/Linux/Mac)
- Expo Go app if you plan to test on a physical device

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start Metro with the project’s preferred port:
```bash
npx expo start --port 8082
```

3. Launch the app:
   - Press `i` to open iOS Simulator
   - Press `a` to open Android Emulator
   - Scan the QR code in Expo Go (ensure phone & computer share the same network)

> **Note:** If another Expo instance is already using port `8082`, press `y` when prompted to allow Expo to pick the next free port (typically `8083`).

## Environment Configuration

Update API endpoints in `config/api.ts` and `config/authApi.ts` to match your backend hosts. Default values target a local network IP (`http://10.252.191.93`) and expect the workout service to run on port `3001`.

## Available Scripts

- `npm start` – Runs `expo start --port 8082 --lan`
- `npm run start:tunnel` – Same as above but opens a tunnel for remote device testing
- `npm run android` / `npm run ios` / `npm run web` – Convenience commands for platform-specific launches

## Project Structure

```
mobile/
├── App.tsx                 # Main app entry with navigation
├── theme.ts                # Theme configuration (black/orange palette)
├── components/             # Reusable UI elements (buttons, cards, etc.)
├── screens/                # Feature screens (Dashboard, Workouts, Profile...)
├── services/               # API clients for workout + auth services
├── config/                 # API endpoint configuration
└── context/                # Auth context for token + user management
```

## Theme

The app uses a black theme with:
- Primary background: `#000000`
- Surface colors: `#1a1a1a`, `#2a2a2a`
- Accent color: `#ff6b35` (orange)
- Text colors with proper contrast

## Technologies

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage (auth token persistence)
- React Native Safe Area Context

