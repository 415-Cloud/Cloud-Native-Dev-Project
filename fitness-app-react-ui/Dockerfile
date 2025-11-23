# Multi-stage build for React frontend
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build arguments for environment variables
ARG REACT_APP_AUTH_SERVICE_URL=http://localhost:8080/api/auth
ARG REACT_APP_USER_SERVICE_URL=http://localhost:8081/api/users
ARG REACT_APP_WORKOUT_SERVICE_URL=http://localhost:3001/api
ARG REACT_APP_CHALLENGE_SERVICE_URL=http://localhost:3002/api
ARG REACT_APP_LEADERBOARD_SERVICE_URL=http://localhost:8083/api

# Set environment variables for build
ENV REACT_APP_AUTH_SERVICE_URL=$REACT_APP_AUTH_SERVICE_URL
ENV REACT_APP_USER_SERVICE_URL=$REACT_APP_USER_SERVICE_URL
ENV REACT_APP_WORKOUT_SERVICE_URL=$REACT_APP_WORKOUT_SERVICE_URL
ENV REACT_APP_CHALLENGE_SERVICE_URL=$REACT_APP_CHALLENGE_SERVICE_URL
ENV REACT_APP_LEADERBOARD_SERVICE_URL=$REACT_APP_LEADERBOARD_SERVICE_URL

# Build the React app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration (optional, for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

