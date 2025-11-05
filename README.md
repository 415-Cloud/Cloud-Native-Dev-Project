# Cloud-Native Fitness Challenge Tracker

A microservices-based fitness tracking application that allows users to log workouts and participate in fitness challenges. This project demonstrates cloud-native architecture patterns including event-driven communication, service decomposition, and data consistency handling.

## 🏗️ Project Overview

This is a distributed fitness tracking system built with Node.js microservices architecture. The system enables users to:
- Log and track various types of workouts (running, cycling, walking, etc.)
- Participate in fitness challenges with specific targets
- Automatically track progress toward challenge goals
- Ensure data consistency across services through event-driven patterns

## 📁 Project Structure

```
cloud-app/
├── workout-service/          # Main workout logging service
│   ├── config.env           # Service configuration
│   ├── Dockerfile            # Containerization config
│   ├── index.js              # Main Express server
│   ├── eventPublisher.js     # RabbitMQ event publisher
│   ├── package.json          # Dependencies
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── migrations/
│       └── 001_initial_workouts.sql
├── challenge-service/        # Challenge management service
│   ├── config.env           # Service configuration
│   ├── Dockerfile            # Containerization config
│   ├── index.js              # Main Express server
│   ├── eventConsumer.js      # RabbitMQ event consumer
│   ├── package.json          # Dependencies
│   └── migrations/
│       └── 001_initial_challenges.sql
├── data-consistency-service/ # Data consistency validator
│   ├── index.js              # Consistency checks and validation
│   └── package.json          # Dependencies
├── docker-compose.yml        # Multi-container orchestration
├── setup.sh                  # Setup automation script
└── database-schema.puml      # Database ER diagram
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

### 4. Event-Driven Architecture

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

### 5. Infrastructure & DevOps

**Docker Setup:**
- Docker Compose configuration for multi-container deployment
- Separate PostgreSQL databases for each service
- RabbitMQ container with management UI
- Hot-reload development environment

**Setup Automation:**
- Automated setup script (`setup.sh`)
- Prisma client generation
- Database migration deployment
- Dependency installation

## 🔧 Technology Stack

**Backend:**
- Node.js with Express.js
- PostgreSQL databases
- Prisma ORM
- RabbitMQ (AMQP)
- Docker & Docker Compose

**Architecture Patterns:**
- Microservices architecture
- Event-driven communication
- Service decomposition
- Database per service pattern
- Eventual consistency

## 📊 Database Schema

### Workout Service Database (`fitness_tracker_workouts`)

**Table: `workouts`**
```sql
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    distance DECIMAL(10,2),
    duration INTEGER NOT NULL,
    calories INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_type ON workouts(type);
CREATE INDEX idx_workouts_created_at ON workouts(created_at);
```

### Challenge Service Database (`fitness_tracker_challenges`)

**Table: `challenges`**
```sql
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_value DECIMAL(10,2),
    target_unit VARCHAR(20),
    created_by VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
```

**Table: `challenge_participants`**
```sql
CREATE TABLE challenge_participants (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    UNIQUE(challenge_id, user_id)
);

-- Indexes
CREATE INDEX idx_participants_user_id ON challenge_participants(user_id);
CREATE INDEX idx_participants_challenge_id ON challenge_participants(challenge_id);
```

**Table: `challenge_progress`**
```sql
CREATE TABLE challenge_progress (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    workout_id INTEGER NOT NULL,
    progress_value DECIMAL(10,2) NOT NULL,
    workout_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id, workout_id)
);

-- Indexes
CREATE INDEX idx_progress_user_id ON challenge_progress(user_id);
CREATE INDEX idx_progress_challenge_id ON challenge_progress(challenge_id);
```

## 🎯 Current Branch

**Branch:** `feature/alex-core-services`

**Status:** Core microservices implementation complete with:
- ✅ Workout tracking service
- ✅ Challenge management service
- ✅ Event-driven integration
- ✅ Data consistency validation
- ⏳ Frontend pending
- ⏳ Authentication service pending
- ⏳ User management service pending

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- Docker and Docker Compose
- RabbitMQ (can be started via Docker)

### Setup Instructions

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd cloud-app
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start with Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Or run services individually:**
   ```bash
   # Terminal 1 - RabbitMQ
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   
   # Terminal 2 - Workout Service
   cd workout-service && npm start
   
   # Terminal 3 - Challenge Service
   cd challenge-service && npm start
   
   # Terminal 4 - Data Consistency Service
   cd data-consistency-service && node index.js
   ```

### Access Points
- **Workout Service:** http://localhost:3001
- **Challenge Service:** http://localhost:3002
- **Data Consistency Service:** http://localhost:3003
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

## 🔄 Event-Driven Workflow

1. **User logs workout** → Workout Service stores in database
2. **Event published** → `workout.logged` to RabbitMQ
3. **Challenge Service consumes** → Checks if user is in active challenges
4. **Progress updated** → Calculates progress based on workout type
5. **Event published** → `challenge.progress` with updated data
6. **Consistency Service validates** → Ensures data integrity
7. **Completion detected** → If goal achieved, marks challenge complete

## 🎨 Architecture Diagrams

The project includes PlantUML diagrams:
- `database-schema.puml` - Overall database schema
- `workout-service/er-diagram.puml` - Workout service schema
- ER diagram images in service directories

## 🔐 Environment Variables

### Workout Service (`workout-service/config.env`)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/fitness_tracker_workouts"
PORT=3001
RABBITMQ_URL="amqp://localhost"
```

### Challenge Service (`challenge-service/config.env`)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/fitness_tracker_challenges"
PORT=3002
RABBITMQ_URL="amqp://localhost"
```

## 🏗️ Next Steps / Roadmap

**TODO:**
- [ ] Add authentication service
- [ ] Implement user management service
- [ ] Build frontend application
- [ ] Add unit and integration tests
- [ ] Implement API gateway
- [ ] Add monitoring and logging (Prometheus, ELK stack)
- [ ] Add rate limiting and security middleware
- [ ] Implement caching layer (Redis)
- [ ] Add CI/CD pipeline

## 📚 Key Features Implemented

✅ **Microservices Architecture** - Separate services for workouts and challenges  
✅ **Event-Driven Communication** - RabbitMQ for asynchronous messaging  
✅ **Database per Service** - Independent data stores  
✅ **Prisma ORM** - Type-safe database access  
✅ **Docker Support** - Containerized deployment  
✅ **Event Sourcing Patterns** - Event-based state management  
✅ **Data Consistency Service** - Cross-service validation  
✅ **Automatic Challenge Tracking** - Real-time progress updates  
✅ **Graceful Shutdown** - Clean service termination  
✅ **Health Checks** - Service monitoring endpoints  



