export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1
        style={{
          color: "var(--foreground)",
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}
      >
        PathFinder Visualizer
      </h1>
      <div
        style={{
          width: "600px",
          height: "600px",
          background: "var(--panel-bg)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555",
          fontSize: "1rem",
        }}
      >
        Grid placeholder
      </div>
    </main>
  );
}
