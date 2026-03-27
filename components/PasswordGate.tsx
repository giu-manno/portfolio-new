"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PasswordGateProps {
  password: string;
  slug: string;
  children: React.ReactNode;
}

export default function PasswordGate({ password, slug, children }: PasswordGateProps) {
  const storageKey = `unlocked-${slug}`;
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(storageKey) === "1") {
      setUnlocked(true);
      setReady(true);
      return;
    }

    const input = window.prompt("This case study is password-protected. Enter password:");

    if (input === password) {
      sessionStorage.setItem(storageKey, "1");
      setUnlocked(true);
    } else {
      router.back();
    }

    setReady(true);
  }, [storageKey, password, router]);

  if (!ready || !unlocked) return null;
  return <>{children}</>;
}
