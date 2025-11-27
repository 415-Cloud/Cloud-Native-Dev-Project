FROM node:18-bullseye

WORKDIR /app

# Install OpenSSL libraries required by Prisma
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3002

# Start command
CMD ["npm", "start"]
