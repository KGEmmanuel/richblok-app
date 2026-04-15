FROM node:18-alpine

WORKDIR /app

# Install only express for serving (lightweight)
RUN npm init -y && npm install express

# Copy pre-built Angular dist files
COPY dist ./dist
COPY server.js .

EXPOSE 8080

ENV PORT=8080
CMD ["node", "server.js"]
