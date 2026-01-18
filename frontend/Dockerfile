FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .

ARG VITE_API_URL
ARG VITE_CDN_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

RUN echo "Build args received:"
RUN echo "VITE_API_URL: $VITE_API_URL"
RUN echo "VITE_CDN_URL: $VITE_CDN_URL"

RUN echo "Contents of .env file:"
RUN cat .env || echo "No .env file"

RUN npm run build

RUN echo "Checking built files:"
RUN grep -r "localhost\|kalanimus" dist/ || echo "No matches found"

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
