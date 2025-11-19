#!/bin/bash

echo "🚀 Setting up Cloud-Native Fitness Challenge Tracker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install it first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install it first."
    exit 1
fi

print_status "Prerequisites check passed"

# Create databases
echo "📊 Creating databases..."
createdb fitness_tracker_workouts 2>/dev/null || print_warning "Workout database might already exist"
createdb fitness_tracker_challenges 2>/dev/null || print_warning "Challenge database might already exist"
print_status "Databases created"

# Install dependencies
echo "📦 Installing dependencies..."

cd services/workout-service
npm install
print_status "Workout service dependencies installed"

cd ../challenge-service
npm install
print_status "Challenge service dependencies installed"

cd ../data-consistency-service
npm install
print_status "Data consistency service dependencies installed"

cd ..

# Generate Prisma clients
echo "🔧 Generating Prisma clients..."

cd services/workout-service
npx prisma generate
print_status "Workout service Prisma client generated"

cd ../challenge-service
npx prisma generate
print_status "Challenge service Prisma client generated"

cd ..

# Run migrations
echo "🗄️  Running database migrations..."

cd services/workout-service
npx prisma migrate deploy
print_status "Workout service migrations completed"

cd ../challenge-service
npx prisma migrate deploy
print_status "Challenge service migrations completed"

cd ..

print_status "Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Make sure RabbitMQ is running: brew services start rabbitmq"
echo "2. Start the services:"
echo "   - Workout Service: cd services/workout-service && npm start"
echo "   - Challenge Service: cd services/challenge-service && npm start"
echo "   - Data Consistency Service: cd data-consistency-service && node index.js"
echo ""
echo "🌐 Access points:"
echo "   - RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo "   - Workout Service: http://localhost:3001"
echo "   - Challenge Service: http://localhost:3002"
echo "   - Data Consistency Service: http://localhost:3003"
