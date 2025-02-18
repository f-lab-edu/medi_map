# 베이스 이미지 설정
FROM node:20-alpine3.18 AS phase1

# 작업 디렉터리 설정
WORKDIR /app

# 필수 패키지 설치 (git 포함)
RUN apk add --no-cache git

# package.json, yarn.lock 먼저 복사하여 캐싱 활용
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

# 전체 프로젝트 코드 복사 (workspaces 포함)
COPY --chown=node:node ./ ./

# 종속성 설치
RUN yarn install --frozen-lockfile

# express-server 빌드 실행
WORKDIR /app/apps/express-server
RUN yarn build

# 실행 시 환경 변수 로드 및 서버 실행
CMD ["yarn", "workspace", "express-server", "start"]