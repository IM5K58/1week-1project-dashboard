# 1주 1서비스 챌린지 대시보드

매주 만든 서비스를 공개적으로 기록하고, 사람들이 탐색하고 피드백할 수 있는 챌린지 아카이브 플랫폼.

## 기술 스택

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **배포**: Vercel

## 주요 기능

- 프로젝트 목록 / 상세 페이지
- 테마별 필터, 키워드 검색
- 플랫폼 배지 (iOS / Web / Android)
- 조회수
- 댓글 (로그인 사용자)
- 관리자 전용 프로젝트 CRUD
- Google / 이메일 로그인

## 로컬 실행

```bash
npm install
npm run dev
```

`.env.local` 파일에 Supabase 환경변수를 설정해야 합니다:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## DB 설정

Supabase SQL Editor에서 `supabase/schema.sql`을 실행하세요.

## 관리자 설정

1. 사이트에서 회원가입
2. Supabase Table Editor > `users` 테이블에서 `role`을 `admin`으로 변경
