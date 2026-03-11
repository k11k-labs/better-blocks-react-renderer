FROM node:20-slim

WORKDIR /app

# Strapi needs these for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY playground/strapi/package.json ./
RUN npm install

# Copy Strapi source and seed DB
COPY playground/strapi/ ./

# Build admin panel
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
