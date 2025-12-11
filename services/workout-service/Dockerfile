FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only and clean cache
RUN npm install --omit=dev && npm cache clean --force

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start command
CMD ["npm", "start"]
