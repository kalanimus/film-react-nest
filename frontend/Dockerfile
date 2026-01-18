FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .

RUN rm -f .env*
ARG VITE_API_URL
ARG VITE_CDN_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

RUN npm run build


FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
