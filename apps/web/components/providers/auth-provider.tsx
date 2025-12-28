"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useExtensionBridge } from "@/hooks/use-extension-bridge";
import { AuthStateSyncMessage } from "@crosslist/shared";

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { sendMessage } = useExtensionBridge();
  const supabase = createClient();
  const lastSyncedSessionId = useRef<string | null>(null);

  // Initial session check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      // Sync initial state if logged in and not already synced
      if (session && session.user.id !== lastSyncedSessionId.current) {
        lastSyncedSessionId.current = session.user.id;
        sendMessage({
          type: "AUTH_STATE_SYNC",
          payload: { session },
        } as AuthStateSyncMessage);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsLoading(false);

      // Sync state to extension only if session actually changed
      const currentSessionId = session?.user.id ?? null;
      if (currentSessionId !== lastSyncedSessionId.current) {
        lastSyncedSessionId.current = currentSessionId;
        sendMessage({
          type: "AUTH_STATE_SYNC",
          payload: { session },
        } as AuthStateSyncMessage);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // Remove sendMessage and supabase from deps - they're stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
