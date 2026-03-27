"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function ViewCounter({ projectId }: { projectId: string }) {
  useEffect(() => {
    const key = `viewed_${projectId}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    const supabase = createClient();
    supabase.rpc("increment_view_count", { p_project_id: projectId }).then(({ error }) => {
      if (error) {
        console.error("조회수 증가 실패:", error.message);
        sessionStorage.removeItem(key);
      }
    });
  }, [projectId]);

  return null;
}
