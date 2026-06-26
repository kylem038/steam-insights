"use client";

import { useState } from "react";

export function GameHeaderImage({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <img
      src={src}
      alt={`${name} header image`}
      className="mt-6 w-full max-w-lg rounded-xl"
      onError={() => setError(true)}
    />
  );
}
