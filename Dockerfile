FROM node:14-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Angular app
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npx ng build --prod || npx ng build

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
