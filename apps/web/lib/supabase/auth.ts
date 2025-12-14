import { createClient } from "./client";

const getRedirectUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000/auth/callback"
  );
};

export type AuthResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
};

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
};

export const resetPasswordForEmail = async (
  email: string,
): Promise<AuthResponse> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getRedirectUrl()}?next=/update-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
};

export const updatePassword = async (
  password: string,
): Promise<AuthResponse> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
};

export const getSession = async () => {
  const supabase = createClient();
  return supabase.auth.getSession();
};

export const getUser = async () => {
  const supabase = createClient();
  return supabase.auth.getUser();
};
