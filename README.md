# Medimap+🏥

사용자가 주변 약국 및 의약품 정보를 쉽고 빠르게 찾을 수 있도록 도와주는 웹 애플리케이션

## 기술 스택🛠️

### 백엔드
 <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Google_Cloud_Platform-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Platform"/>

### 프론트엔드
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/> 
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand"/>
  <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>

### 배포 및 인프라
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/GCP_App_Engine-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Platform"/>
  <img src="https://img.shields.io/badge/GCP_Cloud_SQL-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Platform"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions"/>

### 개발 및 협업 도구 
<img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier"/>

## 주요 기능🚀

### 1. 회원가입 및 로그인
- JWT 인증 기반 회원가입 및 로그인 기능 구현
- NextAuth와의 통합

###  2. 의약품 검색
- 공공 API 연동을 통한 의약품 정보 제공
- 캐싱을 통한 성능 최적화 (React Query 활용)

###  3. 약국 정보 제공
- 사용자의 현재 위치 기반 가까운 약국 검색
- 카카오맵 연동
- 반경 조정 및 지도 내 검색 기능

###  4. 마이페이지 
- 사용자 정보 수정(닉네임, 비밀번호)
- 인증 토큰을 활용한 보안 강화화

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