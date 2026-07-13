"use client";

import type { PropsWithChildren } from "react";
import { Authenticated } from "@refinedev/core";

export function AuthGate({ children }: PropsWithChildren) {
  return (
    <Authenticated
      key="epcvina-auth-gate"
      loading={<div className="p-6 text-slate-300">Đang kiểm tra đăng nhập...</div>}
      redirectOnFail="/login"
    >
      {children}
    </Authenticated>
  );
}
