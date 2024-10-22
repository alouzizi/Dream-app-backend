# Base image
FROM node:18

# Install dockerize to wait for PostgreSQL to be ready
RUN apt-get update && apt-get install -y wget && wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz && rm dockerize-linux-amd64-v0.6.1.tar.gz

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Copy environment files
COPY .env ./

# Copy Prisma schema and migrations
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Bundle app source
COPY . .

# Build the app (this will create a "dist" folder)
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Use dockerize to wait for PostgreSQL, run Prisma migrations, and then start the server
# CMD ["dockerize", "-wait", "tcp://postgres:5432", "-timeout", "60s", "sh", "-c", "npx prisma migrate deploy && npm run start:prod"]

#if you want to run the app in development mode, you can use the following command
CMD ["dockerize", "-wait", "tcp://postgres:5432", "-timeout", "60s", "sh", "-c", "npx prisma migrate dev && npm run start:dev"]
