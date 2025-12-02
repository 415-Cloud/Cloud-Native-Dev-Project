#!/bin/bash
set -e

echo "Initializing workout database schema..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/workouts.ddl.sql

echo "Workout database schema initialized successfully!"

