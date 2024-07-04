# Stage 1: Build the React app
FROM node:20.13.1-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:stable-alpine

# Copy built files from the previous stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 9050
EXPOSE 9051

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
