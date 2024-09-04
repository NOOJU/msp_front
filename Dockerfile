# 1. Stage 1: Build React application
FROM node:18-alpine AS build

WORKDIR /app

# 2. 복사해서 종속성 설치
COPY package*.json ./
RUN npm install

# 3. 소스 복사 및 빌드
COPY . .
RUN npm run build

# 4. Stage 2: Serve React app on 3000 port
FROM node:18-alpine AS serve

WORKDIR /app

# 5. Build output을 복사
COPY --from=build /app/build /app/build

# 6. Serve 파일을 위해 serve 패키지 설치
RUN npm install -g serve

# 7. 3000 포트를 사용
EXPOSE 3000

# 8. 애플리케이션을 3000 포트에서 serve
CMD ["serve", "-s", "build", "-l", "3000"]