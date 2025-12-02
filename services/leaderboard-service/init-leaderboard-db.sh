#!/bin/bash
# Leaderboard Database Initialization Script
# This script can be run manually to initialize the leaderboard database

set -e

# Configuration
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5435}"
DB_NAME="${POSTGRES_DB:-leaderboard_db}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-postgres}"

echo "Initializing Leaderboard Database..."
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"

# Export password for psql
export PGPASSWORD="$DB_PASSWORD"

# Create database if it doesn't exist
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME"

echo "Database '$DB_NAME' ready."

# Run schema
echo "Applying schema..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/src/main/resources/schema.sql"

# Run seed data (optional)
echo "Inserting seed data..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/src/main/resources/data.sql"

echo "Leaderboard database initialization complete!"

