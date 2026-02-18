export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
}
