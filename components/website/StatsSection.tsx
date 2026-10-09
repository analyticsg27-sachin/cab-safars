const steps = [
  "Add route and vehicle details",
  "Browse available trip listings",
  "Review account and trip information",
];

export default function StatsSection() {
  return (
    <section className="py-20 border-y" style={{ backgroundColor: "#0D1117", borderColor: "#243042" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#F0F6FC" }}>
            A place to manage trip listings
          </h2>
          <p style={{ color: "#94A3B8" }}>
            Trip providers can add trip details, and drivers can browse available listings.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((label, index) => (
            <div
              key={label}
              className="relative rounded-2xl p-8 text-center overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #243042" }}
            >
              <p className="relative text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight" style={{ color: "#F5A623" }}>
                {index + 1}
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
