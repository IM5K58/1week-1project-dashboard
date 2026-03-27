"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AdminEditButton({ projectId }: { projectId: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

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

  if (!isAdmin) return null;

  return (
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
  );
}
