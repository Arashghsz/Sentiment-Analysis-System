FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY .babelrc ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app using node with explicit ES modules
CMD ["node", "--experimental-json-modules", "server.js"]