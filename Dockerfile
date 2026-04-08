# Use a lightweight Node.js image
FROM node:25-slim

# Create app directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first (for better layer caching)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create directory for uploads if it doesn't exist
RUN mkdir -p /app/uploads

# Set environment variables
ENV NODE_ENV="production"
ENV PORT="8080"

# Expose port for Cloud Run
EXPOSE 8080

# Use non-root user for security
RUN chown -R node:node /app
USER node

# Run the application
CMD ["npm", "start"]