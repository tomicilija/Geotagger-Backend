FROM node:19

# Set the working directory
WORKDIR /src

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]