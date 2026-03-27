import Link from "next/link";
import type { Project, Platform, Theme } from "@/lib/types";
import { PlatformBadge } from "./PlatformBadge";
import { ThemeBadge } from "./ThemeBadge";

export function ProjectCard({ project }: { project: Project }) {
  const date = project.published_at
    ? new Date(project.published_at).toLocaleDateString("ko-KR")
    : new Date(project.created_at).toLocaleDateString("ko-KR");

  return (
    <Link href={`/projects/${project.slug}`}>
      <article className="glass-card overflow-hidden group cursor-pointer">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden" style={{ background: "#151d35" }}>
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)" }}>
                <svg className="w-8 h-8" style={{ color: "rgba(59,130,246,0.4)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <ThemeBadge theme={project.theme as Theme} />
            {project.platforms.map((p) => (
              <PlatformBadge key={p} platform={p as Platform} />
            ))}
          </div>

          <h3 className="font-semibold text-white text-base sm:text-lg mb-1.5 line-clamp-1 transition-colors" style={{ transition: "color 0.2s" }}>
            {project.title}
          </h3>

          <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: "#94a3b8" }}>
            {project.summary}
          </p>

          <div className="flex items-center justify-between text-xs" style={{ color: "#64748b" }}>
            <span>{date}</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {project.view_count}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
