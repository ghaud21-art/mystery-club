# 🕯 Mystery Club

머더 미스터리 클럽 관리 앱 — React + Vite + Google Apps Script

## 로컬 실행

```bash
npm install
npm run dev
```

## GitHub Pages 배포

### 처음 한 번만

```bash
# 1. GitHub 레포 생성 후 연결
git init
git remote add origin https://github.com/유저명/mystery-club.git

# 2. 의존성 설치
npm install

# 3. CNAME 파일에 도메인 입력 (public/CNAME)
echo "your-domain.com" > public/CNAME

# 4. 수동 배포
npm run deploy
```

### 자동 배포 (GitHub Actions)

`main` 브랜치에 push하면 자동으로 배포됩니다.
`.github/workflows/deploy.yml` 참고.

## Apps Script 연결

1. `src/api.js`의 `BASE` URL을 Apps Script 배포 URL로 교체
2. `murder_mystery_v4.jsx`에서 샘플 데이터 대신 `api.*` 함수 호출

## 도메인 연결 (가비아/네임칩)

GitHub Pages 설정에서 Custom domain 입력 후:

| 레코드 타입 | 호스트 | 값 |
|------------|--------|-----|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | 유저명.github.io |
