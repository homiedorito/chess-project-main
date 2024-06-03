# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /frontend

# Install any needed packages specified in package.json
COPY package*.json ./
RUN npm install

# Copy the current directory contents into the container at /frontend
COPY . .

RUN npm install react-router-dom
RUN npm install chess.js
RUN npm install react-dnd react-dnd-html5-backend

# Build the app
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=0 /frontend/build /usr/share/nginx/html

# Expose port 80 to the world outside this container
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
