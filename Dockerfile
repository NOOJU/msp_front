# 1. React 애플리케이션 빌드
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Nginx로 서빙
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf  # SPA 클라이언트 라우팅을 위한 설정 적용

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
