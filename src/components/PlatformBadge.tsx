import type { Platform } from "@/lib/types";

const platformStyles: Record<Platform, React.CSSProperties> = {
  iOS: { background: "rgba(59,130,246,0.15)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.2)" },
  Web: { background: "rgba(16,185,129,0.15)", color: "#34d399", borderColor: "rgba(16,185,129,0.2)" },
  Android: { background: "rgba(249,115,22,0.15)", color: "#fb923c", borderColor: "rgba(249,115,22,0.2)" },
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className="badge" style={platformStyles[platform]}>
      {platform}
    </span>
  );
}
