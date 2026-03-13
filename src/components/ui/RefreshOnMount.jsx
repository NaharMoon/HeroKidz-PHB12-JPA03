"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const RefreshOnMount = () => {
  const router = useRouter();
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    const timer = setTimeout(() => {
      router.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
};

export default RefreshOnMount;