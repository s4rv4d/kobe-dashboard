import { ConnectButton } from "@/components/wallet/connect-button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="landing-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--electric-orange)] flex items-center justify-center">
            <span className="font-display font-extrabold text-sm text-[var(--black)]">
              D
            </span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            DOSA
          </span>
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <button
              disabled
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Fund
            </button>
            <button
              disabled
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Holdings
            </button>
            <button
              disabled
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              About
            </button>
          </nav>
          <div className="member-badge">
            <span className="pulse-dot" />
            <span>824 members</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-[2] min-h-screen flex flex-col justify-center items-center px-8 py-24">
        <div className="max-w-[900px] w-full animate-in">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <span className="pill pill-violet">&#9672; NFTs</span>
            <span className="pill pill-orange">&#10022; Trading Cards</span>
            <span className="pill pill-green">&#11041; Sneakers</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-center leading-[0.95] tracking-[-0.03em] mb-6 text-[clamp(3rem,8vw,6rem)]">
            <span className="block">Invest in</span>
            <span className="block gradient-text">Culture</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[1.1rem] font-normal leading-relaxed text-[var(--text-gray)] text-center max-w-[500px] mx-auto mb-12">
            A collective fund for the assets that define generations. Grails,
            gems, and the things people actually care about.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-4">
            <ConnectButton variant="pill" />
            <span className="text-sm text-[var(--text-gray)]">
              No wallet?{" "}
              <span className="underline underline-offset-[3px]">
                Learn how to join
              </span>
            </span>
          </div>

          {/* Showcase Section */}
          <div className="mt-24 w-full">
            <div className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--text-gray)] text-center mb-6">
              Recent Acquisitions
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ShowcaseItem
                label="Chromie Squiggle #7842"
                value="+124%"
                icon={"\uD83C\uDFA8"}
              />
              <ShowcaseItem
                label="PSA 10 Charizard 1st Ed"
                value="+89%"
                icon={"\uD83C\uDCCF"}
              />
              <ShowcaseItem
                label="Jordan 1 Chicago '85"
                value="+56%"
                icon={"\uD83D\uDC5F"}
              />
              <ShowcaseItem
                label="Fidenza #313"
                value="+203%"
                icon={"\uD83D\uDC8E"}
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="stats-bar mt-16">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-[var(--electric-orange)] mb-1">
                $12.4M
              </div>
              <div className="text-xs uppercase tracking-wider text-[var(--text-gray)]">
                Fund Value
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-[var(--neon-green)] mb-1">
                847
              </div>
              <div className="text-xs uppercase tracking-wider text-[var(--text-gray)]">
                Assets Held
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-[var(--cool-violet)] mb-1">
                +67%
              </div>
              <div className="text-xs uppercase tracking-wider text-[var(--text-gray)]">
                YTD Return
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-[2] flex flex-col md:flex-row justify-between items-center px-8 py-8 border-t border-[var(--mid-gray)] gap-6 md:gap-0">
        <div className="text-xs text-[var(--text-gray)]">
          &copy; 2026 DOSA. All rights reserved.
        </div>
        <div className="flex gap-6">
          <span className="text-xs text-[var(--text-gray)] cursor-default">
            Terms
          </span>
          <span className="text-xs text-[var(--text-gray)] cursor-default">
            Privacy
          </span>
          <span className="text-xs text-[var(--text-gray)] cursor-default">
            Discord
          </span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="social-circle" aria-label="Twitter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className="social-circle" aria-label="Discord">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

function ShowcaseItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="showcase-item">
      <div className="w-full h-full flex items-center justify-center opacity-50">
        <span className="text-[2rem]">{icon}</span>
      </div>
      <div className="showcase-item-label">
        <div className="text-[0.7rem] font-medium">{label}</div>
        <div className="text-[0.75rem] font-semibold text-[var(--neon-green)]">
          {value}
        </div>
      </div>
    </div>
  );
}
