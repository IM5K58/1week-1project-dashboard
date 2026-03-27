import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-7xl font-bold gradient-text mb-4">404</h1>
      <p className="text-lg text-slate-400 mb-8">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="btn-primary inline-block px-6 py-3"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
