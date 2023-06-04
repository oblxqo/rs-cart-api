# Base
FROM node:14-alpine AS base

WORKDIR /app

#Dependencies
COPY package*.json ./
RUN npm install

# Build
WORKDIR /app
COPY . .
RUN npm run build

# Aplication
FROM node:14-alpine AS application

COPY --from=base /app/packacge*.json ./
RUN npm install --only=production
RUN npm install pm2 -g
COPY --from=base /app/dist ./dist

USER node
ENV PORT=8000
EXPOSE 8000

CMD ["pm2-runtime", "dist/main.js"]