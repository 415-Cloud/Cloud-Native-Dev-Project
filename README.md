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

## 🌐 REST API Overview

### Auth & User Service
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Authenticate and return JWT |
| GET | /api/users/{id} | Get user profile |
| PUT | /api/users/{id} | Update user profile |

### Workout Service
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/workouts | Log new workout |
| GET | /api/workouts/{userId} | Retrieve user's workouts |
| PUT | /api/workouts/{id} | Update workout |
| DELETE | /api/workouts/{id} | Delete workout |

### Challenge Service
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /api/challenges | List all challenges |
| POST | /api/challenges | Create challenge |
| POST | /api/challenges/{id}/join | Join challenge |
| DELETE | /api/challenges/{id}/leave | Leave challenge |

### Leaderboard Service
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /api/leaderboards/{challengeId} | Get challenge rankings |
| GET | /api/leaderboards/global | Get global leaderboard |

### Coach Service (AI)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/coach/generate | Generate personalized training plan |
| GET | /api/coach/{userId}/plan | Retrieve user’s saved plan |

---

## 🗄️ Database Schemas (PostgreSQL)

### Users
| Field | Type | Description |
|--------|------|-------------|
| user_id | UUID (PK) | Unique identifier |
| email | VARCHAR | User email |
| password_hash | TEXT | Secure password hash |
| name | VARCHAR | Full name |
| fitness_level | VARCHAR | Beginner, Intermediate, Advanced |
| goals | TEXT | User goals |

### Workouts
| Field | Type | Description |
|--------|------|-------------|
| workout_id | UUID (PK) | Unique workout ID |
| user_id | FK | Linked to Users |
| type | VARCHAR | e.g., Running, Cycling |
| duration | INT | Minutes |
| distance | FLOAT | km or miles |
| calories | INT | Estimated calories burned |
| date | DATE | Workout date |

### Challenges
| Field | Type | Description |
|--------|------|-------------|
| challenge_id | UUID (PK) | Unique challenge ID |
| name | VARCHAR | Challenge title |
| goal | VARCHAR | Step or distance goal |
| start_date | DATE | Challenge start date |
| end_date | DATE | Challenge end date |

### ChallengeMemberships
| Field | Type | Description |
|--------|------|-------------|
| user_id | FK | Linked to Users |
| challenge_id | FK | Linked to Challenges |
| join_date | DATE | Date joined |
| progress | FLOAT | % completion |

### Notifications
| Field | Type | Description |
|--------|------|-------------|
| notification_id | UUID (PK) | Unique ID |
| user_id | FK | Linked to Users |
| message | TEXT | Notification content |
| type | VARCHAR | Reminder, Achievement, Update |
| sent_date | DATE | Sent timestamp |
| read_status | BOOLEAN | Read/unread flag |

---

## 🔔 Event-Driven Workflow

When a user logs a workout:

1. **Workout Service** saves workout → publishes `workout_logged` event to RabbitMQ.  
2. **Challenge Service** consumes event → updates user’s progress.  
3. **Leaderboard Service** consumes event → updates rankings in Redis.  
4. **Notification Service (future)** sends achievement or progress notifications.  
5. **Analytics (future)** aggregates metrics for insights.  

This asynchronous pattern allows scalability and eventual consistency.

---
## 🤖 External API Integration

The **Coach Service** integrates with the **OpenAI API** for personalized training plans.

**Inputs:**
- User profile data (fitness level, goals)
- Past workouts
- Active challenges

**Output:**
- Structured weekly plan (JSON)
- Caching in Redis for fast retrieval

**Fallback:**
- Static rule-based plan when API unavailable.

---


## 🧩 System Architecture Diagram
**Frontend (React)** → **API Gateway** → **Microservices (Auth, Workout, Challenge, Leaderboard, Coach)**  
↳ **RabbitMQ** (message broker)  
↳ **PostgreSQL** (per service DB)  
↳ **Redis** (leaderboard + caching)

---

## 🐳 Deployment Overview
Each microservice will have:
- Its own **Dockerfile** and container  
- **Kubernetes manifests** for deployment  
- **ConfigMaps** for environment variables  
- **Secrets** for credentials and API keys  
- **Ingress** for unified access routing  
- **Health checks** and autoscaling rules  

Redis and PostgreSQL will be deployed as managed pods or services within the cluster.

---

## ✅ Testing & CI/CD

**Testing Strategy:**
- **Unit Tests:** Jest (Node.js), pytest (Python)  
- **Integration Tests:** Supertest for REST APIs  
- **E2E Flow:** User registration → join challenge → log workout → leaderboard update  
- **Mock external APIs:** to isolate logic

**CI/CD Pipeline:**
- **GitHub Actions**
  - Run tests and lint on PRs  
  - Enforce 80% code coverage  
  - Build and push Docker images to registry  
  - Auto-deploy to Kubernetes cluster  

---


## 🎯 Demo Script
1. Register/login  
2. Join a “5k October Challenge”  
3. Log workouts and see leaderboard update in real time  
4. Generate a personalized weekly plan  
5. Receive notifications about progress  

---
