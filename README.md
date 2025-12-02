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

![ER Diagram - All Services](diagrams/er-diagram-all-services.png)

## 📁 Project Structure

```
cloud-app/
├── k8s/                              # Kubernetes manifests
│   ├── challenge-service-deployment.yaml
│   ├── challenge-service-service.yaml
│   ├── leaderboard-service-configmap.yaml
│   ├── workout-service-deployment.yaml
│   └── workout-service-service.yaml
├── diagrams/                         # Generated architecture and ER visuals
│   ├── architecture.png
│   ├── architecture.puml
│   ├── database-erd.puml
│   └── er-diagram-all-services.png
├── database/
│   └── seed.sql                      # Shared seed data
├── services/                         # All microservices
│   ├── workout-service/              # Main workout logging service (Node.js)
│   │   ├── config.env                # Service configuration
│   │   ├── Dockerfile                # Containerization config
│   │   ├── eventPublisher.js         # RabbitMQ event publisher
│   │   ├── index.js                  # Main Express server
│   │   ├── package.json              # Dependencies
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Prisma schema
│   │   └── schema/
│   │       └── workouts.ddl.sql      # Relational DDL
│   ├── challenge-service/            # Challenge management service (Node.js)
│   │   ├── config.env                # Service configuration
│   │   ├── Dockerfile                # Containerization config
│   │   ├── eventConsumer.js          # RabbitMQ event consumer
│   │   ├── index.js                  # Main Express server
│   │   ├── package.json              # Dependencies
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Prisma schema
│   │   └── schema/
│   │       └── challenges.ddl.sql    # Relational DDL
│   ├── data-consistency-service/     # Data consistency validator (Node.js)
│   │   ├── Dockerfile                # Containerization config
│   │   ├── index.js                  # Consistency checks and validation
│   │   ├── package.json              # Dependencies
│   │   └── prisma/                   # Prisma configuration
│   ├── auth-service/                 # Authentication service (Java Spring Boot)
│   │   ├── Dockerfile                # Containerization config
│   │   ├── pom.xml                   # Maven dependencies
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/.../authservice/
│   │       │   │   ├── config/       # Configuration classes
│   │       │   │   ├── controller/   # REST controllers
│   │       │   │   ├── dto/          # Data transfer objects
│   │       │   │   ├── model/        # Entity models
│   │       │   │   ├── repository/   # Data repositories
│   │       │   │   └── service/      # Business logic
│   │       │   └── resources/
│   │       │       ├── application.properties
│   │       │       ├── schema.sql    # Database schema
│   │       │       └── data.sql      # Seed data
│   │       └── test/                 # Test files
│   ├── user-service/                 # User profile service (Java Spring Boot)
│   │   ├── Dockerfile                # Containerization config
│   │   ├── pom.xml                   # Maven dependencies
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/.../userservice/
│   │       │   │   ├── config/       # Configuration classes
│   │       │   │   ├── controller/   # REST controllers
│   │       │   │   ├── dto/          # Data transfer objects
│   │       │   │   ├── model/        # Entity models
│   │       │   │   ├── repository/   # Data repositories
│   │       │   │   ├── security/     # Security configuration
│   │       │   │   └── service/      # Business logic
│   │       │   └── resources/
│   │       │       ├── application.properties
│   │       │       ├── schema.sql    # Database schema
│   │       │       └── data.sql      # Seed data
│   │       └── test/                 # Test files
│   ├── leaderboard-service/          # Leaderboard service (Java Spring Boot)
│   │   ├── Dockerfile                # Containerization config
│   │   ├── pom.xml                   # Maven dependencies
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/.../leaderboardservice/
│   │       │   │   ├── config/       # Configuration classes
│   │       │   │   ├── controller/   # REST controllers
│   │       │   │   ├── model/        # Entity models
│   │       │   │   └── service/      # Business logic
│   │       │   └── resources/
│   │       │       └── application.yml
│   │       └── test/                 # Test files
│   ├── notification-service/         # Notification service (Java Spring Boot)
│   │   ├── Dockerfile                # Containerization config
│   │   ├── pom.xml                   # Maven dependencies
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/.../notificationservice/
│   │       │   │   ├── config/       # Configuration classes
│   │       │   │   ├── messaging/    # Message listeners
│   │       │   │   ├── model/        # Entity models
│   │       │   │   └── service/      # Business logic
│   │       │   └── resources/
│   │       │       └── application.yml
│   │       └── test/                 # Test files
│   └── ai-coach-service/             # AI coach service (Node.js)
│       ├── Dockerfile                # Containerization config
│       ├── app.js                    # Main Express server
│       ├── package.json              # Dependencies
│       ├── routes/
│       │   └── coach.js              # Coach routes
│       └── services/
│           └── llm.js                # LLM integration
├── fitness-app-react-ui/             # React frontend application
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
├── docker-compose.yml                # Multi-container orchestration
├── init-db.sh                        # Database initialization script
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
- ✅ Real-time leaderboard rankings using Redis Sorted Sets
- ✅ Score updates based on workout activities
- ✅ Daily streak tracking for users
- ✅ Top N leaderboard queries
- ✅ Individual user rank retrieval

**Data Storage:**
- Redis in-memory database for high-performance leaderboard operations
- Uses Redis Sorted Sets (ZSet) for efficient ranking queries
- Uses Redis Hashes for streak tracking

**Redis Key-Value Structure:**

**1. Global Leaderboard (Sorted Set)**
- **Key:** `global:leaderboard`
- **Type:** Sorted Set (ZSet)
- **Member:** `userId` (String)
- **Score:** User's total score (Double)
- **Purpose:** Stores all user rankings sorted by score for efficient top-N queries

**Example:**
```
Key: "global:leaderboard"
Member: "user123" → Score: 150.5
Member: "user456" → Score: 200.0
```

**2. User Streak Tracking (Hash)**
- **Key Pattern:** `user:streak:{userId}` (e.g., `user:streak:user123`)
- **Type:** Hash
- **Fields:**
  - `count`: Current streak count (Long as String)
  - `lastDate`: Last recorded workout date in ISO format (String, e.g., "2024-01-15")
- **Purpose:** Tracks daily workout streaks per user

**Example:**
```
Key: "user:streak:user123"
Field: "count" → Value: "5"
Field: "lastDate" → Value: "2024-01-15"
```

**API Endpoints:**
- `GET /api/leaderboard/top?n={number}` - Get top N users
- `GET /api/leaderboard/rank/{userId}` - Get user's rank and score
- `GET /health` - Health check

**Configuration:**
- Redis host and port configurable via environment variables
- Default: `localhost:6379`

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

## 📝 Example API Usage

### Create a Workout
```bash
curl -X POST http://localhost:3001/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "type": "running",
    "distance": 5.0,
    "duration": 30,
    "calories": 300
  }'
```

### Create a Challenge
```bash
curl -X POST http://localhost:3002/challenges \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Running Challenge",
    "description": "Run 50km this month",
    "type": "running",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "targetValue": 50,
    "targetUnit": "km",
    "createdBy": "admin123"
  }'
```

### Join a Challenge
```bash
curl -X POST http://localhost:3002/challenges/1/join \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'
```

### Register a New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "fitnessLevel": "Intermediate",
    "goals": "Complete a marathon",
    "profileInfo": "Active runner"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": "2671845f-b245-414a-9161-4570e5ecf46d",
  "tokenType": "Bearer"
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": "2671845f-b245-414a-9161-4570e5ecf46d",
  "tokenType": "Bearer"
}
```

### Get User Profile (Requires JWT)
```bash
curl -X GET http://localhost:8081/api/users/{userId} \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**
```json
{
  "userId": "2671845f-b245-414a-9161-4570e5ecf46d",
  "email": "user@example.com",
  "name": "John Doe",
  "profileInfo": "Active runner",
  "fitnessLevel": "Intermediate",
  "goals": "Complete a marathon",
  "createdAt": "2025-11-15T06:01:54",
  "updatedAt": "2025-11-15T06:01:54"
}
```

### Update User Profile (Requires JWT)
```bash
curl -X PUT http://localhost:8081/api/users/{userId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "fitnessLevel": "Advanced",
    "goals": "Complete an ultramarathon",
    "profileInfo": "Experienced runner and cyclist"
  }'
```

## Event-Driven Workflow

1. **User logs workout** → Workout Service stores in database
2. **Event published** → `workout.logged` to RabbitMQ
3. **Challenge Service consumes** → Checks if user is in active challenges
4. **Progress updated** → Calculates progress based on workout type
5. **Event published** → `challenge.progress` with updated data
6. **Consistency Service validates** → Ensures data integrity
7. **Completion detected** → If goal achieved, marks challenge complete


## 🔐 Environment Variables

### Workout Service (`services/workout-service/config.env`)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/fitness_tracker_workouts"
PORT=3001
RABBITMQ_URL="amqp://localhost"
```

### Challenge Service (`services/challenge-service/config.env`)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/fitness_tracker_challenges"
PORT=3002
RABBITMQ_URL="amqp://localhost"
```

### Auth Service (`services/auth-service/src/main/resources/application.properties`)
```
spring.datasource.url=jdbc:postgresql://postgres:5432/auth_db
spring.datasource.username=postgres
spring.datasource.password=postgres
user-service.url=http://user-service:8081/api/users/create
server.port=8080
```

### User Service (`services/user-service/src/main/resources/application.properties`)
```
spring.datasource.url=jdbc:postgresql://postgres:5432/user_db
spring.datasource.username=postgres
spring.datasource.password=postgres
server.port=8081
```

### Leaderboard Service (`services/leaderboard-service/src/main/resources/application.yml`)
```yaml
server:
  port: ${SERVER_PORT:8082}
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
  rabbitmq:
    host: ${RABBITMQ_HOST:localhost}
    port: ${RABBITMQ_PORT:5672}
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}
```



