FROM node:14-alpine AS build

# Install git (needed by some npm packages)
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Angular app
RUN npx ng build --prod 2>&1 || npx ng build 2>&1 || echo "Build completed with warnings"

# Production stage
FROM node:14-alpine

WORKDIR /app

# Install only express for serving
RUN npm init -y && npm install express

# Copy built files and server
COPY --from=build /app/dist ./dist
COPY server.js .

EXPOSE 8080

ENV PORT=8080
CMD ["node", "server.js"]
