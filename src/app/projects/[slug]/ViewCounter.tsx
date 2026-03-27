"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function ViewCounter({ projectId }: { projectId: string }) {
  useEffect(() => {
    const supabase = createClient();
    supabase.rpc("increment_view_count", { project_id: projectId });
  }, [projectId]);

  return null;
}
