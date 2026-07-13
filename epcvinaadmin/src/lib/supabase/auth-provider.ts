"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "./browser";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    if (!supabaseBrowserClient) {
      return {
        success: false,
        error: { name: "SupabaseMissing", message: "Thiếu Supabase env" },
      };
    }

    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error };
    }

    if (data.user) {
      return { success: true, redirectTo: "/" };
    }

    return {
      success: false,
      error: { name: "LoginFailed", message: "Đăng nhập thất bại" },
    };
  },
  register: async ({ email, password }) => {
    if (!supabaseBrowserClient) {
      return {
        success: false,
        error: { name: "SupabaseMissing", message: "Thiếu Supabase env" },
      };
    }

    const { data, error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error };
    }

    if (data.user) {
      return { success: true, redirectTo: "/" };
    }

    return {
      success: false,
      error: { name: "RegisterFailed", message: "Đăng ký thất bại" },
    };
  },
  logout: async () => {
    if (!supabaseBrowserClient) {
      return { success: true, redirectTo: "/login" };
    }
    await supabaseBrowserClient.auth.signOut();
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    if (!supabaseBrowserClient) {
      return { authenticated: false, redirectTo: "/login", logout: true };
    }
    const { data } = await supabaseBrowserClient.auth.getSession();
    return {
      authenticated: Boolean(data.session),
      redirectTo: "/login",
      logout: !data.session,
    };
  },
  getIdentity: async () => {
    if (!supabaseBrowserClient) return null;
    const { data } = await supabaseBrowserClient.auth.getUser();
    const user = data.user;
    if (!user) return null;
    return {
      id: user.id,
      name: user.email ?? "Admin",
    };
  },
  onError: async (error) => {
    if (error) {
      return {
        error,
        logout: false,
      };
    }

    return { logout: false };
  },
};
