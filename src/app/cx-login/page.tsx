"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CxLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(`/track${query ? `?${query}` : ""}`);
  }, [router, searchParams]);

  return null;
}

export default function CxLoginPage() {
  return (
    <Suspense fallback={null}>
      <CxLoginRedirect />
    </Suspense>
  );
}
