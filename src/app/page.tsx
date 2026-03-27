export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/ProjectCard";
import { SearchFilter } from "@/components/SearchFilter";
import type { Project } from "@/lib/types";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ theme?: string; search?: string }>;
}

async function ProjectList({
  theme,
  search,
}: {
  theme?: string;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (theme) {
    query = query.eq("theme", theme);
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,summary.ilike.%${search}%`
    );
  }

  const { data: projects } = await query;

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <svg className="w-8 h-8" style={{ color: "#475569" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p style={{ color: "#64748b" }}>아직 프로젝트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {(projects as Project[]).map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  return (
    <div>
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-14">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3b82f6" }} />
          누적 프로젝트 {count ?? 0}개
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 gradient-text leading-tight">
          록오의 1주 1서비스 챌린지
        </h1>
        <p className="max-w-md mx-auto leading-relaxed text-sm sm:text-base" style={{ color: "#94a3b8" }}>
          매주 하나의 서비스를 만들고 기록합니다.
          <br />
          아이디어부터 완성까지, 도전의 과정을 공유합니다.
        </p>
      </section>

      {/* Search & Filter */}
      <section className="mb-8">
        <Suspense>
          <SearchFilter />
        </Suspense>
      </section>

      {/* Project Grid */}
      <Suspense
        fallback={
          <div className="text-center py-20" style={{ color: "#64748b" }}>
            로딩 중...
          </div>
        }
      >
        <ProjectList theme={params.theme} search={params.search} />
      </Suspense>
    </div>
  );
}
