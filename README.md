# Cloud-Native Fitness Challenge Tracker

A microservices-based fitness tracking application that allows users to log workouts and participate in fitness challenges. This project demonstrates cloud-native architecture patterns including event-driven communication, service decomposition, and data consistency handling.

**Fun Fact:** The system processes workout events in real-time using RabbitMQ, ensuring that challenge progress updates happen automatically without manual intervention.

## 🏗️ Project Overview

This is a distributed fitness tracking system built with Node.js microservices architecture. The system enables users to:
- Log and track various types of workouts (running, cycling, walking, etc.)
- Participate in fitness challenges with specific targets
- Automatically track progress toward challenge goals
- Ensure data consistency across services through event-driven patterns

### System Architecture

![System Architecture](diagrams/architecture.png)

### Database Schema - ER Diagram

![ER Diagram - All Services](diagrams/Combined%20ER%20Diagram%20-%20All%20Services.png)


## 📁 Project Structure

```
cloud-app/
├── .github/
│   └── workflows/                    # GitHub Actions CI/CD workflows
│       ├── ai-coach-service.yml
│       ├── leaderboard-service.yml
│       └── workout-service.yml
├── diagrams/                         # Generated architecture and ER visuals
│   ├── architecture-compact.puml
│   ├── architecture.png
│   ├── Combined ER Diagram - All Services.png
│   ├── database-erd.puml
│   └── er-diagram-all-services.png
├── fitness-app-react-ui/             # React frontend application
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/               # Reusable components
│       │   ├── Navbar.js
│       │   └── Navbar.css
│       ├── screens/                  # Screen components
│       │   ├── ChallengesScreen.js
│       │   ├── DashboardScreen.js
│       │   ├── LandingPage.js
│       │   ├── LeaderboardScreen.js
│       │   ├── LoginScreen.js
│       │   ├── ProfileScreen.js
│       │   ├── RegisterScreen.js
│       │   ├── SurveyScreen.js
│       │   ├── TrainingPlanScreen.js
│       │   └── WorkoutLogScreen.js
│       ├── services/
│       │   └── api.js                # API service layer
│       ├── App.js
│       ├── index.js
│       └── index.css
├── k8s/                              # Kubernetes manifests
│   ├── ai-coach-service-deployment.yaml
│   ├── ai-coach-service-secret.yaml
│   ├── ai-coach-service-service.yaml
│   ├── auth-service-deployment.yaml
│   ├── challenge-db-deployment.yaml
│   ├── challenge-service-configmap.yaml
│   ├── challenge-service-deployment.yaml
│   ├── data-consistency-service-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml
│   ├── leaderboard-service-configmap.yaml
│   ├── leaderboard-service-deployment.yaml
│   ├── leaderboard-service-secret.yaml
│   ├── rabbitmq-deployment.yaml
│   ├── user-service-deployment.yaml
│   ├── workout-db-deployment.yaml
│   ├── workout-service-configmap.yaml
│   └── workout-service-deployment.yaml
├── services/                         # All microservices
│   ├── ai-coach-service/             # AI coach service (Node.js)
│   │   ├── Dockerfile
│   │   ├── app.js                    # Main Express server
│   │   ├── package.json
│   │   ├── routes/
│   │   │   └── coach.js
│   │   └── services/
│   │       └── llm.js
│   ├── auth-service/                 # Authentication service (Java Spring Boot)
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/.../authservice/
│   │       │   │   ├── config/
│   │       │   │   ├── controller/
│   │       │   │   ├── dto/
│   │       │   │   ├── model/
│   │       │   │   ├── repository/
│   │       │   │   └── service/
│   │       │   └── resources/
│   │       │       ├── application.properties
│   │       │       ├── data.sql
│   │       │       └── schema.sql
│   │       └── test/
│   ├── challenge-service/            # Challenge management service (Node.js)
│   │   ├── config.env
│   │   ├── Dockerfile
│   │   ├── Dockerfile-db
│   │   ├── eventConsumer.js
│   │   ├── index.js
│   │   ├── package.json
│   │   └── schema/
│   │       ├── challenges.ddl.sql
│   │       └── challenges.seed.sql
│   ├── data-consistency-service/     # Data consistency validator (Node.js)
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   ├── leaderboard-service/          # Leaderboard service (Java Spring Boot)
│   │   ├── Dockerfile
│   │   ├── Dockerfile-db
│   │   ├── init-leaderboard-db.sh
│   │   ├── pom.xml
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/.../leaderboardservice/
│   │       │   │   ├── controller/
│   │       │   │   ├── entity/
│   │       │   │   ├── model/
│   │       │   │   ├── repository/
│   │       │   │   └── service/
│   │       │   └── resources/
│   │       │       ├── application.yml
│   │       │       ├── data.sql
│   │       │       └── schema.sql
│   │       └── test/
│   ├── user-service/                 # User profile service (Java Spring Boot)
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/.../userservice/
│   │       │   │   ├── config/
│   │       │   │   ├── controller/
│   │       │   │   ├── dto/
│   │       │   │   ├── model/
│   │       │   │   ├── repository/
│   │       │   │   ├── security/
│   │       │   │   └── service/
│   │       │   └── resources/
│   │       │       ├── application.properties
│   │       │       ├── data.sql
│   │       │       └── schema.sql
│   │       └── test/
│   └── workout-service/              # Main workout logging service (Node.js)
│       ├── .dockerignore
│       ├── config.env
│       ├── Dockerfile
│       ├── Dockerfile-db
│       ├── eventPublisher.js
│       ├── index.js
│       ├── package.json
│       └── schema/
│           ├── workouts.ddl.sql
│           └── workouts.seed.sql
├── build-push.sh                     # Script to build and push Docker images
├── docker-compose.yml                # Multi-container orchestration
├── init-challenge-db.sh              # Challenge database initialization
├── init-db.sh                        # Main database initialization
├── init-workout-db.sh                # Workout database initialization
└── README.md                         # Project documentation
```

## 🚀 Completed Features

### 1. Workout Service (Port 3001)

**Functionality:**
- ✅ Create workouts with type, distance, duration, calories, and notes
- ✅ Retrieve all workouts for a specific user
- ✅ Get individual workout by ID
- ✅ Update existing workouts
- ✅ Delete workouts
- ✅ Publish workout events to RabbitMQ for other services


aaa
**Database:**
- PostgreSQL database (`fitness_tracker_workouts`)
- Prisma ORM for type-safe database access
- Workouts table with indexes on user_id, type, and created_at

**API Endpoints:**
- `POST /workouts` - Log a new workout
- `GET /users/:userId/workouts` - Get all workouts for a user
- `GET /workouts/:id` - Get specific workout
- `PUT /workouts/:id` - Update workout
- `DELETE /workouts/:id` - Delete workout
- `GET /health` - Health check

### 2. Challenge Service (Port 3002)

**Functionality:**
- ✅ Create fitness challenges with targets
- ✅ List all active challenges
- ✅ Get challenge details by ID
- ✅ Join challenges as a participant
- ✅ Leave challenges
- ✅ Track challenge progress automatically
- ✅ Detect challenge completion
- ✅ Listen to workout events and update progress

**Database:**
- PostgreSQL database (`fitness_tracker_challenges`)
- Tables: challenges, challenge_participants, challenge_progress
- Automatic progress tracking based on workout types

**API Endpoints:**
- `POST /challenges` - Create a new challenge
- `GET /challenges` - List all active challenges
- `GET /challenges/:id` - Get challenge details
- `POST /challenges/:id/join` - Join a challenge
- `DELETE /challenges/:id/leave` - Leave a challenge
- `GET /users/:userId/challenges` - Get user's challenges
- `GET /challenges/:id/participants` - Get challenge participants
- `GET /health` - Health check

### 3. Data Consistency Service (Port 3003)

**Functionality:**
- ✅ Subscribe to workout and challenge events
- ✅ Verify data consistency across services
- ✅ Recalculate challenge progress
- ✅ Handle eventual consistency scenarios
- ✅ Monitor and log data integrity issues

**Features:**
- Cross-service data validation
- Automatic progress recalculation
- Challenge completion detection
- Error logging and monitoring

### 4. Auth Service (Port 8080)

**Functionality:**
- ✅ User registration with email and password
- ✅ User login with JWT token generation
- ✅ Password hashing using BCrypt
- ✅ Email validation
- ✅ Automatic user profile creation in user-service

**Database:**
- PostgreSQL database (`auth_db`)
- Credentials table for authentication data
- BCrypt password hashing for security

**API Endpoints:**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /health` - Health check

### 5. User Service (Port 8081)

**Functionality:**
- ✅ User profile management
- ✅ Profile retrieval by user ID
- ✅ Profile updates (name, fitness level, goals, etc.)
- ✅ JWT authentication for protected endpoints
- ✅ Internal API for auth-service integration

**Database:**
- PostgreSQL database (`user_db`)
- Users table for profile information
- Fitness level and goals tracking

**API Endpoints:**
- `GET /api/users/{userId}` - Get user profile (requires JWT)
- `PUT /api/users/{userId}` - Update user profile (requires JWT)
- `POST /api/users/create` - Internal endpoint for profile creation
- `GET /health` - Health check

### 6. Leaderboard Service (Port 8082)

**Functionality:**
- ✅ Real-time leaderboard rankings
- ✅ Score updates based on workout activities
- ✅ Daily streak tracking for users
- ✅ Top N leaderboard queries
- ✅ Individual user rank retrieval

**Database:**
- PostgreSQL database (`leaderboard_db`)
- Leaderboard entries table with indexes for efficient ranking queries
- Automatic streak calculation based on daily activity

**API Endpoints:**
- `POST /leaderboard/update/{userId}` - Update user score
- `GET /leaderboard/top/{n}` - Get top N users
- `GET /leaderboard/rank/{userId}` - Get user's rank and score
- `GET /health` - Health check

**Configuration:**
- PostgreSQL database connection configurable via environment variables
- Default: `localhost:5435`

### 7. Event-Driven Architecture

**Messaging Infrastructure:**
- RabbitMQ message broker for service communication
- Topic-based exchanges (`fitness_events`)
- Durable queues for reliability
- Event types:
  - `workout.logged` - New workout registered
  - `challenge.progress` - Challenge progress updated
  - `challenge.completed` - Challenge completed

**Event Flow:**
1. User logs workout → Workout Service publishes `workout.logged`
2. Challenge Service receives event → Updates progress
3. Challenge Service publishes `challenge.progress`
4. Data Consistency Service validates consistency

**Event Flow Diagram:**
```
Workout Service → publishes "workout.logged" → RabbitMQ
                                           ↓
                    ┌──────────────────────┴──────────────────────┐
                    ↓                                              ↓
         Challenge Service (consumes)              Data Consistency Service (consumes)
                    ↓                                              ↓
         Updates challenge progress                    Verifies data integrity
         Publishes "challenge.progress"                Recalculates progress
                    ↓                                              ↓
                    └──────────────────────┬──────────────────────┘
                                           ↓
                              Data Consistency Service (consumes)
                                           ↓
                              Verifies challenge consistency
```



### Access Points
- **Workout Service:** http://localhost:3001
- **Challenge Service:** http://localhost:3002
- **Data Consistency Service:** http://localhost:3003
- **Auth Service:** http://localhost:8080
- **User Service:** http://localhost:8081
- **Leaderboard Service:** http://localhost:8082
- **Frontend (React):** http://localhost:3000
- **RabbitMQ Management UI:** http://localhost:15672 (guest/guest)

## Event-Driven Workflow

1. **User logs workout** → Workout Service stores in database
2. **Event published** → `workout.logged` to RabbitMQ
3. **Challenge Service consumes** → Checks if user is in active challenges
4. **Progress updated** → Calculates progress based on workout type
5. **Event published** → `challenge.progress` with updated data
6. **Consistency Service validates** → Ensures data integrity
7. **Completion detected** → If goal achieved, marks challenge complete


