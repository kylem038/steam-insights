"use client";

import Image from "next/image";
import { useState } from "react";

export function GameHeaderImage({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <Image
      src={src}
      alt={`${name} header image`}
      width={460}
      height={215}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      className="mt-6 max-w-lg rounded-xl"
      onError={() => setError(true)}
    />
  );
}
