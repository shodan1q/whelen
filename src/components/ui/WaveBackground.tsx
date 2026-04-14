"use client";

export function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg
        className="absolute bottom-0 w-[200%] animate-wave"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "120px" }}
      >
        <path
          fill="rgba(46, 134, 171, 0.15)"
          d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 w-[200%] animate-wave"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "80px", animationDelay: "-5s", animationDuration: "15s" }}
      >
        <path
          fill="rgba(201, 169, 110, 0.08)"
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,160C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
}
