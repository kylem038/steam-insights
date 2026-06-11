"use client";

export function Timestamp({ iso }: { iso: string }) {
  return <>{new Date(iso).toLocaleString()}</>;
}
