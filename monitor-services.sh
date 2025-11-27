#!/bin/bash

# Script to open multiple Terminal windows for monitoring Docker services
# Usage: ./monitor-services.sh

PROJECT_DIR="/Users/alexsanch3zx/Desktop/cloud-native/cloud-app"

# Function to open a new Terminal window with a command
open_terminal_window() {
    local service_name=$1
    local command=$2
    
    osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$PROJECT_DIR' && $command"
    set custom title of front window to "$service_name"
end tell
EOF
}

echo "Opening Terminal windows for service monitoring..."

# Open Terminal windows for each service
open_terminal_window "PostgreSQL (Auth/User)" "docker compose logs -f postgres"
sleep 0.5

open_terminal_window "Workout DB" "docker compose logs -f workout-db"
sleep 0.5

open_terminal_window "Challenge DB" "docker compose logs -f challenge-db"
sleep 0.5

open_terminal_window "RabbitMQ" "docker compose logs -f rabbitmq"
sleep 0.5

open_terminal_window "Auth Service" "docker compose logs -f auth-service"
sleep 0.5

open_terminal_window "User Service" "docker compose logs -f user-service"
sleep 0.5

open_terminal_window "Workout Service" "docker compose logs -f workout-service"
sleep 0.5

open_terminal_window "Challenge Service" "docker compose logs -f challenge-service"
sleep 0.5

open_terminal_window "Data Consistency" "docker compose logs -f data-consistency-service"
sleep 0.5

open_terminal_window "Frontend" "docker compose logs -f frontend"
sleep 0.5

open_terminal_window "All Services" "docker compose logs -f"
sleep 0.5

open_terminal_window "Container Status" "watch -n 2 'docker compose ps'"

echo "Done! All monitoring windows should be open."
echo ""
echo "Each Terminal window is now showing logs for a specific service."
echo "The window titles show which service is being monitored."

