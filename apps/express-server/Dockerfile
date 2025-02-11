# 베이스 이미지 설정
FROM node:20-alpine3.18 AS phase1

# 작업 디렉터리 설정
WORKDIR /app

# package.json이 변경될 경우에만 yarn 실행
COPY --chown=node:node turbo.json .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node package.json .

# 필요한 디렉터리 생성
RUN mkdir -p apps/express-server

# 필요한 패키지 파일만 복사
COPY --chown=node:node ./apps/express-server/package.json apps/express-server
COPY --chown=node:node ./apps/express-server apps/express-server

# 종속성 설치
RUN yarn

# express-server 빌드
RUN yarn build

# 개발 환경에서 서버 실행
CMD ["yarn", "workspace", "express-server", "start"]