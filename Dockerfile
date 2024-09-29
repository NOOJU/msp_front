# 1. Stage 1: Build React application
FROM node:18-alpine AS build

WORKDIR /app

# 2. 복사해서 종속성 설치
COPY package*.json ./
RUN npm install

# 3. 소스 복사 및 빌드
COPY . .
RUN npm run build

# 4. Stage 2: Nginx를 사용하여 애플리케이션 제공
FROM nginx:alpine

# 5. Nginx 설정 파일 복사
COPY ./nginx.conf /etc/nginx/nginx.conf

# 6. 인증서 파일 복사
COPY ./selfsigned.crt /etc/nginx/ssl/selfsigned.crt
COPY ./selfsigned.key /etc/nginx/ssl/selfsigned.key

# 7. 빌드된 React 앱 복사
COPY --from=build /app/build /usr/share/nginx/html

# 8. 443 포트 오픈
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]