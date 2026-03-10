export default function TerminalDemo() {
  return (
    <div className="w-full max-w-[640px] lg:max-w-none">
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center font-[family-name:var(--font-mono)] text-xs text-text-muted">
            pikname validate
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-5 lg:p-6 font-[family-name:var(--font-mono)] text-[13px] lg:text-[14px] leading-[1.8]">
          <div>
            <span className="text-accent">$</span>{" "}
            <span className="text-text-primary">
              pikname &quot;AI scheduling tool for consultants&quot;
            </span>
          </div>
          <br />
          <div>
            <span className="text-text-secondary">? Who is your target audience?</span>{" "}
            <span className="text-accent">Solo consultants & freelancers</span>
          </div>
          <div>
            <span className="text-text-secondary">? What vibe fits your brand?</span>{" "}
            <span className="text-accent">Professional & minimal</span>
          </div>
          <br />
          <div className="text-text-secondary">Generating names...</div>
          <br />
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">CalendarIQ</span>{" "}
            <span className="text-text-muted">&mdash; calendariq.com</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">Scheduly</span>{" "}
            <span className="text-text-muted">&mdash; scheduly.io</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <div>
            <span className="text-warning">!</span>{" "}
            <span className="text-text-primary">MeetFlow</span>{" "}
            <span className="text-text-muted">&mdash; meetflow.com</span>{" "}
            <span className="text-warning">taken</span>
          </div>
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">BookSync</span>{" "}
            <span className="text-text-muted">&mdash; booksync.app</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">Slotwise</span>{" "}
            <span className="text-text-muted">&mdash; slotwise.dev</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <br />
          <div>
            <span className="text-info">i</span>{" "}
            <span className="text-text-secondary">Brand score: </span>
            <span className="text-accent">CalendarIQ 92/100</span>{" "}
            <span className="text-text-muted">| Trademark: clear</span>
          </div>
          <div>
            <span className="text-accent">$</span>{" "}
            <span className="inline-block w-2 h-4 bg-accent align-text-bottom animate-blink" />
          </div>
        </div>
      </div>
    </div>
  );
}
