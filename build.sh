#!/bin/bash

# .env 파일 로드
export $(grep -v '^#' .env | xargs)

# Docker 빌드 명령어
docker build -t henny1105/next-client \
  --build-arg GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
  --build-arg GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
  --build-arg NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
  --build-arg NEXT_PUBLIC_LOCAL_BACKEND_URL=$NEXT_PUBLIC_LOCAL_BACKEND_URL \
  --build-arg NEXTAUTH_URL=$NEXTAUTH_URL \
  -f ./apps/next-client/Dockerfile .