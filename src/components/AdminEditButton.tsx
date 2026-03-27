"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminEditButton({ projectId }: { projectId: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };
    check();
  }, []);

  const handleDelete = async () => {
    if (!confirm("정말 이 프로젝트를 삭제하시겠습니까?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/projects/${projectId}/edit`}
        className="badge inline-flex items-center gap-1.5 px-3 py-1.5"
        style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.2)", color: "#3b82f6", fontSize: "0.875rem" }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        수정
      </Link>
      <button
        onClick={handleDelete}
        className="badge inline-flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
        style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.875rem" }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        삭제
      </button>
    </div>
  );
}
