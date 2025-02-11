# 베이스 이미지 설정
FROM node:20-alpine3.18 AS base

# 필요한 종속성 추가
RUN apk add --no-cache libc6-compat

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package.json yarn.lock ./
COPY apps/next-client/package.json apps/next-client/

# 종속성 설치
RUN yarn --frozen-lockfile

# 애플리케이션 코드 복사
COPY apps/next-client apps/next-client

# Next.js 애플리케이션 빌드
RUN yarn workspace next-client build

# 애플리케이션 실행 포트 공개 (기본값: 3000)
EXPOSE 3000

# 애플리케이션 시작
CMD ["yarn", "workspace", "next-client", "start"]