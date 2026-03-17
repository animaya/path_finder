import { Stats } from "@/lib/stats";

export default function StatsPanel({ stats }: { stats: Stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "0.5rem",
      }}
    >
      <StatBox label="Explored" value={stats.exploredCount} unit="cells" color="#38bdf8" />
      <StatBox label="Path" value={stats.pathLength} unit="cells" color="#facc15" />
      <StatBox label="Time" value={stats.durationMs} unit="ms" color="#a78bfa" />
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#0d0d18",
        border: `1px solid ${color}44`,
        borderRadius: "8px",
        padding: "0.5rem 0.4rem",
        textAlign: "center",
      }}
    >
      <div style={{ color, fontSize: "1.1rem", fontWeight: 700 }}>{value}</div>
      <div style={{ color: "#666", fontSize: "0.65rem" }}>
        {label} ({unit})
      </div>
    </div>
  );
}
