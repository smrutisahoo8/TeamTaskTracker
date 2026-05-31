# Base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY . .

# Build TypeScript (if you have build step)
RUN npm run build

# Expose backend port
EXPOSE 4000

# Start backend
CMD ["npm", "run", "dev"]