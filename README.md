# Cloud Native Project – Fitness Challenge Tracker

## 📌 Application Nature and Purpose
The **Fitness Challenge Tracker** is a cloud-native web application designed to help students and community members:
- Join fitness challenges (steps, running, cycling)
- Log workouts and track progress
- Compete on leaderboards
- Receive personalized training plans from an AI-lite service  

**Purpose:** Promote health, friendly competition, and engagement using a scalable, microservices-based cloud platform.

---

## 👥 Team Members
-  Alex Sanchez  
-  Patrick Manswell
-  Shane Ivey


---

## 🏗️ Estimated Modules
- **Auth Service** – registration, authentication, JWT sessions  
- **User Service** – profiles, goals, preferences  
- **Workout Service** – workout logging, validation  
- **Challenge Service** – challenge creation, membership  
- **Leaderboard Service** – rankings, streaks (Redis)  
- **Coach Service (AI-lite)** – personalized weekly plans  
- **Notification Service** – reminders via email/push  
- **Frontend Web App** – UI for users (React + Tailwind)  

---

## 💻 Estimated Languages and Frameworks
- **Frontend:** JavaScript/TypeScript with React + Tailwind CSS  
- **Backend Services:** Node.js (Express) or Python (FastAPI)  
- **Databases:** PostgreSQL (core), Redis (leaderboards, caching)  
- **Messaging/Event Bus:** RabbitMQ or NATS  
- **Containerization:** Docker  
- **Orchestration:** Kubernetes 

---

## 🖥️ UI Overview & Primary Actions
The user interface will provide:
- **Login / Register** – access via email authentication  
- **Dashboard** – personal stats and active challenges  
- **Challenges Page** – browse, join, or leave challenges  
- **Workout Log Form** – record activity type, distance, duration  
- **Leaderboard View** – see personal rank and top competitors  
- **Training Plan View** – view AI-generated weekly training recommendations  
- **Notifications Panel** – reminders and updates  

---

## 🎯 Demo Script
1. Register/login  
2. Join a “5k October Challenge”  
3. Log workouts and see leaderboard update in real time  
4. Generate a personalized weekly plan  
5. Receive notifications about progress  

---
