FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx tsc -p tsconfig.build.json

FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER appuser
EXPOSE 3001
CMD ["node", "dist/index.js"]
