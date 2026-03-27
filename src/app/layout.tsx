import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "오인겸의 1주 1서비스 챌린지",
  description:
    "매주 만든 서비스를 공개적으로 기록하고, 사람들이 탐색하고 피드백할 수 있는 챌린지 아카이브",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning className="min-h-screen antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
