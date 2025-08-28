"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Something went wrong</h2>
      <p>{error?.message || "Unknown error"}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}


