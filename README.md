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

- Node.js (v14 or higher)
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
mobile/
├── App.tsx                 # Main app entry with navigation
├── theme.ts               # Theme configuration
├── components/            # Reusable UI components
│   ├── WorkoutCard.tsx
│   ├── ExerciseItem.tsx
│   └── Button.tsx
└── screens/              # App screens
    ├── HomeScreen.tsx
    └── WorkoutDetailScreen.tsx
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

