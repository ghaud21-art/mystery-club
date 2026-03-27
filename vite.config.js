import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 레포지토리 이름으로 변경
  // 커스텀 도메인 사용 시 '/' 그대로 유지
  base: '/',
})
