#!/bin/bash
set -e

echo "Initializing challenge database schema..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/challenges.ddl.sql

echo "Challenge database schema initialized successfully!"

