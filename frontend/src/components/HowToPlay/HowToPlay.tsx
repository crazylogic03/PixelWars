export default function HowToPlay() {
  const steps = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l6 6-4 1 3 5-2 1-3-5-3 3V7l3-2z" />
      ),
      text: "Click on any white tile to capture it",
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h6v6H4zM14 7h6v6h-6zM9 14h6v6H9z" />
      ),
      text: "Each tile you capture is yours",
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.2-7-11V5l7-3 7 3v5c0 6.8-7 11-7 11z" />
      ),
      text: "Compete with other players",
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3z" />
      ),
      text: "Build your territory and climb the leaderboard!",
    },
  ];

  return (
    <div className="card p-[22px]">
      {/* Header */}
      <div className="section-header">
        <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>How to Play</span>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {step.icon}
            </svg>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
