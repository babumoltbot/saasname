export default function TerminalDemo() {
  return (
    <div className="mt-[72px] w-full max-w-[640px] animate-fade-up animate-fade-up-5 max-[768px]:mt-12 max-[768px]:max-w-full max-[480px]:mt-9">
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 px-[18px] py-3.5 border-b border-border max-[480px]:px-3.5 max-[480px]:py-2.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] max-[480px]:w-2.5 max-[480px]:h-2.5" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] max-[480px]:w-2.5 max-[480px]:h-2.5" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] max-[480px]:w-2.5 max-[480px]:h-2.5" />
          <span className="flex-1 text-center font-[family-name:var(--font-mono)] text-xs text-text-muted max-[480px]:text-[11px]">
            saasname validate
          </span>
        </div>
        <div className="p-6 font-[family-name:var(--font-mono)] text-[13px] leading-[1.8] max-[768px]:p-4 max-[768px]:text-xs max-[768px]:leading-[1.7] max-[768px]:overflow-x-auto max-[480px]:p-3.5 max-[480px]:text-[11px] max-[480px]:leading-[1.6]">
          <div>
            <span className="text-accent">$</span>{" "}
            <span className="text-text-primary">
              saasname &quot;AI scheduling tool for consultants&quot;
            </span>
          </div>
          <br />
          <div>
            <span className="text-text-secondary">Generating names...</span>
          </div>
          <br />
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">CalendarIQ</span>{" "}
            <span className="text-text-secondary">&mdash; calendariq.com</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">Scheduly</span>{" "}
            <span className="text-text-secondary">&mdash; scheduly.io</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <div>
            <span className="text-warning">!</span>{" "}
            <span className="text-text-primary">MeetFlow</span>{" "}
            <span className="text-text-secondary">&mdash; meetflow.com</span>{" "}
            <span className="text-warning">taken</span>
          </div>
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">BookSync</span>{" "}
            <span className="text-text-secondary">&mdash; booksync.app</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <div>
            <span className="text-accent">&#10003;</span>{" "}
            <span className="text-text-primary">Slotwise</span>{" "}
            <span className="text-text-secondary">&mdash; slotwise.dev</span>{" "}
            <span className="text-accent">available</span>
          </div>
          <br />
          <div>
            <span className="text-info">i</span>{" "}
            <span className="text-text-secondary">Brand score: </span>
            <span className="text-accent">CalendarIQ 92/100</span>{" "}
            <span className="text-text-secondary">| Trademark: clear</span>
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
