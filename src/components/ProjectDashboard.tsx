"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "./ProjectCard";
import { THEMES } from "@/lib/types";
import type { Project } from "@/lib/types";

export function ProjectDashboard({ projects }: { projects: Project[] }) {
  const [theme, setTheme] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = projects;
    if (theme) {
      result = result.filter((p) => p.theme === theme);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, theme, search]);

  return (
    <div>
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-14">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3b82f6" }} />
          누적 프로젝트 {projects.length}개
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
      <section className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="프로젝트 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dark-input search-input w-full"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#64748b" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTheme("")} className={!theme ? "btn-primary text-sm" : "chip"}>
            전체
          </button>
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(theme === t ? "" : t)}
              className={theme === t ? "btn-primary text-sm" : "chip"}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Project Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <svg className="w-8 h-8" style={{ color: "#475569" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p style={{ color: "#64748b" }}>
            {search || theme ? "검색 결과가 없습니다." : "아직 프로젝트가 없습니다."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
