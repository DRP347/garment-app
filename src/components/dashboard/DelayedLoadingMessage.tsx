"use client";

import { useEffect, useState } from "react";

export default function DelayedLoadingMessage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <p className="mt-4 text-sm font-medium text-slate-500">
      Still loading your workspace...
    </p>
  );
}

