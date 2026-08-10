"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ConnectFacebookPageButton() {
  const router = useRouter();

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.type !== "facebook-page-connected") return;
      if (typeof event.data.target === "string" && event.data.target.startsWith("/")) {
        router.replace(event.data.target);
        return;
      }
      router.refresh();
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  const openPopup = () => {
    const width = 680;
    const height = 760;
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
    const popup = window.open(
      "/api/content/facebook/connect?popup=1",
      "facebook-connect",
      [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        "popup=yes",
        "noopener=no",
        "noreferrer=no",
      ].join(","),
    );
    popup?.focus();
  };

  return (
    <button
      type="button"
      onClick={openPopup}
      className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white"
    >
      Kết nối Facebook Page
    </button>
  );
}
