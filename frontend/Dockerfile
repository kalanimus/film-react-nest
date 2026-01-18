FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .

RUN rm -f .env*
ARG VITE_API_URL
ARG VITE_CDN_URL
RUN echo "VITE_API_URL=$VITE_API_URL" > .env
RUN echo "VITE_CDN_URL=$VITE_CDN_URL" >> .env
RUN echo "=== Created .env file ==="
RUN cat .env
RUN echo "=== Environment variables ==="
RUN env | grep VITE || echo "No VITE vars"

RUN npm run build

RUN echo "=== Checking built files ==="
RUN grep -o "http[^\"']*" dist/assets/*.js | head -5 || echo "No HTTP URLs found"


FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
