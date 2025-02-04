FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Set environment variable
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]