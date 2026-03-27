"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment, User as AppUser } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

interface CommentWithUser extends Comment {
  user: AppUser;
}

export function CommentSection({ projectId }: { projectId: string }) {
  const supabase = createClient();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsAdmin(profile?.role === "admin");
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, user:users(*)")
      .eq("project_id", projectId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    if (data) setComments(data as CommentWithUser[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    if (content.length > 1000) {
      alert("댓글은 1000자까지 작성 가능합니다.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      project_id: projectId,
      user_id: user.id,
      content: content.trim(),
    });

    if (!error) {
      setContent("");
      fetchComments();
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    await supabase
      .from("comments")
      .update({ is_deleted: true })
      .eq("id", commentId);
    fetchComments();
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-6">
        댓글 {comments.length > 0 && (
          <span style={{ color: "#3b82f6" }}>{comments.length}</span>
        )}
      </h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 남겨주세요..."
            maxLength={1000}
            rows={3}
            className="dark-input w-full resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs" style={{ color: "#64748b" }}>
              {content.length}/1000
            </span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="btn-primary text-sm"
            >
              {loading ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 glass-card p-5 text-center text-sm" style={{ color: "#94a3b8" }}>
          댓글 작성은{" "}
          <a href="/login" className="font-medium hover:underline" style={{ color: "#3b82f6" }}>
            로그인
          </a>{" "}
          후 가능합니다.
        </div>
      )}

      {/* Comment list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-center text-sm py-10" style={{ color: "#64748b" }}>
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  {comment.user?.profile_image_url ? (
                    <img src={comment.user.profile_image_url} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))", color: "#60a5fa" }}
                    >
                      {comment.user?.nickname?.[0] || "?"}
                    </div>
                  )}
                  <span className="text-sm font-medium" style={{ color: "#cbd5e1" }}>
                    {comment.user?.nickname || "익명"}
                  </span>
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    {new Date(comment.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs transition-colors"
                    style={{ color: "rgba(248,113,113,0.6)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(248,113,113,0.6)")}
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "#cbd5e1" }}>
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
