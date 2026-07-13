"use client";

import type { PropsWithChildren } from "react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { dataProvider } from "@refinedev/supabase";
import { authProvider } from "@/lib/supabase/auth-provider";
import { supabaseBrowserClient } from "@/lib/supabase/browser";

const resources = [
  {
    name: "combos",
    list: "/combos",
    edit: "/combos/[id]/edit",
    show: "/combos/[id]",
    meta: { label: "Combo" },
  },
  {
    name: "products",
    list: "/products",
    edit: "/products/[id]",
    show: "/products/[id]",
    meta: { label: "Sản phẩm" },
  },
] as const;

export function Providers({ children }: PropsWithChildren) {
  if (!supabaseBrowserClient) {
    return <>{children}</>;
  }

  const refineDataProvider = dataProvider(supabaseBrowserClient);

  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={refineDataProvider}
      authProvider={authProvider}
      resources={resources as unknown as Parameters<typeof Refine>[0]["resources"]}
      options={{
        disableTelemetry: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      {children}
    </Refine>
  );
}
