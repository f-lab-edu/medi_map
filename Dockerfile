FROM node:20-alpine3.18

WORKDIR /app

# 1) 루트에 있는 주요 설정/패키지 파일들 복사
COPY turbo.json .
COPY tsconfig.json .
COPY package.json .

# 2) express-server 폴더 통째로 복사
COPY apps/express-server ./apps/express-server

# 3) 의존성 설치 & 빌드
RUN yarn
RUN yarn build

# 4) 실행
CMD ["yarn", "workspace", "express-server", "start"]
