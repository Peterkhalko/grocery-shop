# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install MongoDB
RUN curl https://cosign.mongodb.com/server.pem > server.pem

# Expose ports for Node.js and MongoDB
EXPOSE 3000
EXPOSE 27017

# Copy the application code into the container
COPY . .

# Command to run your application
CMD ["node", "app.js"]
