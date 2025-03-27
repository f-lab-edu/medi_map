# Medimap+🏥

약국 위치 정보와 약물 정보를 한 곳에 모아볼 수 있는 서비스

## 기술 스택🛠️

### 백엔드
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/> <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize"/> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/> <img src="https://img.shields.io/badge/Google_Cloud_Platform-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Platform"/>

### 프론트엔드
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/> <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand"/> <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS"/> <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="NextAuth.js"/> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="TanStack Query"/> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>

### 배포 및 인프라
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/> <img src="https://img.shields.io/badge/GCP_App_Engine-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Platform"/> <img src="https://img.shields.io/badge/GCP_Cloud_SQL-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Platform"/> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions"/>

### 개발 및 협업 도구
<img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code"/> <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/> <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman"/> <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier"/>

## 주요 기능🚀

### 1. 회원가입 및 로그인
- NextAuth.js를 활용한 Google OAuth 및 자체 로그인 구현
- JWT 기반 인증 시스템

### 2. 의약품 검색
- 공공 API 연동을 통한 의약품 정보 제공
- 캐싱을 통한 응답 속도 개선

### 3. 약국 정보 제공
- 사용자의 현재 위치 기반 가까운 약국 검색
- 카카오맵 연동
- 반경 조정 및 지도 내 검색 기능

### 4. 마이페이지 
- 사용자 정보 수정(닉네임, 비밀번호)
- 즐겨찾기 약물 리스트 확인 및 삭제제

### 5. CI/CD 및 배포
- GitHub Actions를 통한 자동화된 빌드 및 배포
- Docker 컨테이너화를 통한 개발/운영 환경 일관성 유지
- GCP App Engine 및 Cloud SQL을 활용한 클라우드 인프라 구축

## 로컬 개발 실행 방법⚙️
### 백엔드
```js
cd apps/express-server
yarn install
yarn dev
```

### 프론트엔드 

```js
cd apps/next-client
yarn install
yarn dev
```

## 배포🚢

### 데이터베이스 설정 
```js
# 마이그레이션 실행
cd back-end
yarn sequelize db:migrate
```