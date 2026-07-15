const stats = [
  { number: "50,000+", label: "Loads Moved" },
  { number: "12,000+", label: "Registered Users" },
  { number: "500+", label: "Cities Covered" },
  { number: "₹50 Cr+", label: "Revenue Generated" },
];

export default function StatsSection() {
  return (
    <section className="py-20 border-y" style={{ backgroundColor: "#0D1117", borderColor: "#243042" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#F0F6FC" }}>
            Trusted by Indian transport professionals
          </h2>
          <p style={{ color: "#94A3B8" }}>
            Numbers that reflect the scale of India&apos;s growing transport network.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ number, label }) => (
            <div
              key={label}
              className="relative rounded-2xl p-8 text-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid #243042",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              {/* Glow behind number */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(245,166,35,0.12), transparent 70%)",
                }}
              />

              <p
                className="relative text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #F5A623 0%, #FFD97D 60%, #F5A623 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 12px rgba(245,166,35,0.35))",
                }}
              >
                {number}
              </p>
              <p className="relative text-sm font-medium" style={{ color: "#94A3B8" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
