import type { Theme } from "@/lib/types";

const themeStyles: Record<Theme, React.CSSProperties> = {
  "게임": { background: "rgba(239,68,68,0.15)", color: "#f87171", borderColor: "rgba(239,68,68,0.2)" },
  "교육": { background: "rgba(234,179,8,0.15)", color: "#facc15", borderColor: "rgba(234,179,8,0.2)" },
  "도구": { background: "rgba(168,85,247,0.15)", color: "#c084fc", borderColor: "rgba(168,85,247,0.2)" },
  "생산성": { background: "rgba(20,184,166,0.15)", color: "#2dd4bf", borderColor: "rgba(20,184,166,0.2)" },
  "실험작": { background: "rgba(236,72,153,0.15)", color: "#f472b6", borderColor: "rgba(236,72,153,0.2)" },
  AI: { background: "rgba(6,182,212,0.15)", color: "#22d3ee", borderColor: "rgba(6,182,212,0.2)" },
  "기타": { background: "rgba(148,163,184,0.15)", color: "#94a3b8", borderColor: "rgba(148,163,184,0.2)" },
};

const fallback = themeStyles["기타"];

export function ThemeBadge({ theme }: { theme: Theme }) {
  return (
    <span className="badge" style={themeStyles[theme] || fallback}>
      {theme}
    </span>
  );
}
