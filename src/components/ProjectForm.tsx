"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { THEMES, PLATFORMS } from "@/lib/types";
import type { Project, Theme, Platform } from "@/lib/types";

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!project;

  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [summary, setSummary] = useState(project?.summary || "");
  const [content, setContent] = useState(project?.content || "");
  const [theme, setTheme] = useState<Theme>((project?.theme as Theme) || "기타");
  const [platforms, setPlatforms] = useState<Platform[]>((project?.platforms as Platform[]) || []);
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail_url || "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [deployUrl, setDeployUrl] = useState(project?.deploy_url || "");
  const [appstoreUrl, setAppstoreUrl] = useState(project?.appstore_url || "");
  const [playstoreUrl, setPlaystoreUrl] = useState(project?.playstore_url || "");
  const [isPublished, setIsPublished] = useState(project?.is_published ?? true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w\s가-힣-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEdit) setSlug(generateSlug(value));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("thumbnails")
      .upload(fileName, file);

    if (uploadError) {
      setError("업로드 실패: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(fileName);

    setThumbnailUrl(publicUrl);
    setUploading(false);
  };

  const togglePlatform = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("로그인이 필요합니다."); setLoading(false); return; }

    const projectData = {
      title, slug, summary, content, theme, platforms,
      thumbnail_url: thumbnailUrl || null,
      github_url: githubUrl || null,
      deploy_url: deployUrl || null,
      appstore_url: appstoreUrl || null,
      playstore_url: playstoreUrl || null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (isEdit) {
      const { error } = await supabase.from("projects").update(projectData).eq("id", project.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase.from("projects").insert({ ...projectData, author_id: user.id });
      if (error) { setError(error.message); setLoading(false); return; }
    }

    router.push("/");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!confirm("정말 이 프로젝트를 삭제하시겠습니까?")) return;
    setLoading(true);
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">
        {isEdit ? "프로젝트 수정" : "새 프로젝트"}
      </h1>

      {error && <div className="alert-error">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#cbd5e1" }}>제목 *</label>
        <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} required className="dark-input w-full" placeholder="프로젝트 제목" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#cbd5e1" }}>슬러그 *</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="dark-input w-full" placeholder="project-slug" />
        <p className="text-xs mt-1.5" style={{ color: "#64748b" }}>URL에 사용됩니다: /projects/{slug || "..."}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#cbd5e1" }}>한 줄 소개 *</label>
        <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} required className="dark-input w-full" placeholder="프로젝트를 한 줄로 설명해주세요" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#cbd5e1" }}>테마 *</label>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button key={t} type="button" onClick={() => setTheme(t)} className={theme === t ? "btn-primary text-sm" : "chip"}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#cbd5e1" }}>플랫폼 (복수 선택 가능)</label>
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <button key={p} type="button" onClick={() => togglePlatform(p)} className={platforms.includes(p) ? "btn-primary text-sm" : "chip"}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#cbd5e1" }}>썸네일 이미지</label>

        {/* Preview */}
        {thumbnailUrl && (
          <div className="mb-3 relative inline-block">
            <img src={thumbnailUrl} alt="미리보기" className="max-h-40 rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
            <button
              type="button"
              onClick={() => setThumbnailUrl("")}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
              style={{ background: "rgba(239,68,68,0.8)" }}
            >
              X
            </button>
          </div>
        )}

        {/* Upload */}
        <label
          className="glass-card flex flex-col items-center justify-center py-6 cursor-pointer mb-2"
          style={{ borderStyle: "dashed" }}
        >
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          {uploading ? (
            <p className="text-sm" style={{ color: "#94a3b8" }}>업로드 중...</p>
          ) : (
            <>
              <svg className="w-8 h-8 mb-2" style={{ color: "#64748b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm" style={{ color: "#94a3b8" }}>클릭하여 이미지 업로드 (최대 5MB)</p>
            </>
          )}
        </label>

        {/* URL fallback */}
        <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="dark-input w-full" placeholder="또는 이미지 URL 직접 입력" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#cbd5e1" }}>상세 설명 *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={15}
          className="dark-input w-full resize-y font-mono text-sm"
          placeholder={`## 프로젝트 소개\n\n## 왜 만들었는지\n\n## 핵심 기능\n\n## 사용 기술\n\n## 회고 / 느낀 점`}
        />
        <p className="text-xs mt-1.5" style={{ color: "#64748b" }}>## 제목, ### 소제목, - 목록, {">"} 인용 문법을 사용할 수 있습니다.</p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium" style={{ color: "#cbd5e1" }}>외부 링크</label>
        <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="dark-input w-full" placeholder="GitHub URL" />
        <input type="url" value={deployUrl} onChange={(e) => setDeployUrl(e.target.value)} className="dark-input w-full" placeholder="배포 URL" />
        <input type="url" value={appstoreUrl} onChange={(e) => setAppstoreUrl(e.target.value)} className="dark-input w-full" placeholder="App Store URL" />
        <input type="url" value={playstoreUrl} onChange={(e) => setPlaystoreUrl(e.target.value)} className="dark-input w-full" placeholder="Play Store URL" />
      </div>

      <div className="flex items-center gap-3">
        <div onClick={() => setIsPublished(!isPublished)} className={`toggle ${isPublished ? "toggle-on" : "toggle-off"}`}>
          <div className={`toggle-knob ${isPublished ? "toggle-knob-on" : "toggle-knob-off"}`} />
        </div>
        <label className="text-sm font-medium cursor-pointer" style={{ color: "#cbd5e1" }} onClick={() => setIsPublished(!isPublished)}>
          공개
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 flex-wrap">
        <button type="submit" disabled={loading} className="btn-primary px-6 py-3">
          {loading ? "저장 중..." : isEdit ? "수정하기" : "발행하기"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} disabled={loading} className="ghost-btn" style={{ color: "#f87171" }}>
            삭제
          </button>
        )}
        <button type="button" onClick={() => router.back()} className="ghost-btn">
          취소
        </button>
      </div>
    </form>
  );
}
