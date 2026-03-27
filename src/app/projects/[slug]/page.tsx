export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PlatformBadge } from "@/components/PlatformBadge";
import { ThemeBadge } from "@/components/ThemeBadge";
import { CommentSection } from "@/components/CommentSection";
import { AdminEditButton } from "@/components/AdminEditButton";
import { ViewCounter } from "./ViewCounter";
import type { Project, Platform, Theme } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) {
    notFound();
  }

  const p = project as Project;
  const date = p.published_at
    ? new Date(p.published_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(p.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const links = [
    { label: "GitHub", url: p.github_url },
    { label: "배포 링크", url: p.deploy_url },
    { label: "App Store", url: p.appstore_url },
    { label: "Play Store", url: p.playstore_url },
  ].filter((l) => l.url);

  return (
    <article className="max-w-3xl mx-auto">
      <ViewCounter projectId={p.id} />

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <ThemeBadge theme={p.theme as Theme} />
          {p.platforms.map((platform) => (
            <PlatformBadge key={platform} platform={platform as Platform} />
          ))}
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 leading-tight">
          {p.title}
        </h1>
        <p className="text-base sm:text-lg mb-5" style={{ color: "#94a3b8" }}>{p.summary}</p>

        <div className="flex items-center gap-3 flex-wrap text-sm" style={{ color: "#64748b" }}>
          <AdminEditButton projectId={p.id} />
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {p.view_count}
          </span>
        </div>
      </header>

      {/* Thumbnail */}
      {p.thumbnail_url && (
        <div className="mb-8 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <img src={p.thumbnail_url} alt={p.title} className="w-full object-cover" />
        </div>
      )}

      {/* External Links */}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {links.map((link) => (
            <a key={link.label} href={link.url!} target="_blank" rel="noopener noreferrer" className="link-pill">
              {link.label}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="glass-card p-5 sm:p-8 mb-10">
        <div className="space-y-1">
          {p.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-4">{line.replace("## ", "")}</h2>;
            }
            if (line.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-semibold mt-6 mb-3" style={{ color: "#e2e8f0" }}>{line.replace("### ", "")}</h3>;
            }
            if (line.startsWith("- ")) {
              return <li key={i} className="list-disc ml-6 mb-1" style={{ color: "#cbd5e1" }}>{line.replace("- ", "")}</li>;
            }
            if (line.startsWith("> ")) {
              return <blockquote key={i} className="border-l-4 pl-4 italic mb-4" style={{ borderColor: "rgba(139,92,246,0.5)", color: "#94a3b8" }}>{line.replace("> ", "")}</blockquote>;
            }
            if (line.trim() === "") {
              return <br key={i} />;
            }
            return <p key={i} className="mb-4 leading-relaxed" style={{ color: "#cbd5e1" }}>{line}</p>;
          })}
        </div>
      </div>

      {/* Comments */}
      <CommentSection projectId={p.id} />
    </article>
  );
}
