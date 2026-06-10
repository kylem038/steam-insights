"use client";

import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GameOption {
  app_id: number;
  name: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<GameOption[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (inputValue === "") return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/games/search?q=${encodeURIComponent(inputValue)}`,
        );
        if (res.ok) {
          setOptions(await res.json());
        } else {
          setOptions([]);
        }
      } catch {
        setOptions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      onChange={(_, value) => {
        if (value) {
          router.push(`/games/${value.app_id}`);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search games" variant="outlined" />
      )}
      sx={{ width: 400 }}
      noOptionsText="No games found"
      isOptionEqualToValue={(option, value) => option.app_id === value.app_id}
    />
  );
}
