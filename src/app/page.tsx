export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import type { Project } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return <ProjectDashboard projects={(projects as Project[]) || []} />;
}
