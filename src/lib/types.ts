export type Theme = "게임" | "교육" | "도구" | "생산성" | "실험작" | "AI" | "기타";
export type Platform = "iOS" | "Web" | "Android";

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  theme: Theme;
  platforms: Platform[];
  thumbnail_url: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_id: string;
  is_published: boolean;
  github_url: string | null;
  deploy_url: string | null;
  appstore_url: string | null;
  playstore_url: string | null;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  profile_image_url: string | null;
  role: "user" | "admin";
  created_at: string;
}

export interface Comment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user?: User;
}

export const THEMES: Theme[] = ["게임", "교육", "도구", "생산성", "실험작", "AI", "기타"];
export const PLATFORMS: Platform[] = ["iOS", "Web", "Android"];
