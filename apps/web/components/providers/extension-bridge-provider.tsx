"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { BridgeMessage, isBridgeMessage } from "@crosslist/shared";

type ExtensionBridgeContextType = {
  isExtensionAvailable: boolean;
  extensionVersion: string | null;
  sendMessage: (_message: BridgeMessage) => void;
};

const ExtensionBridgeContext = createContext<ExtensionBridgeContextType>({
  isExtensionAvailable: false,
  extensionVersion: null,
  sendMessage: () => {},
});

export function ExtensionBridgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [extensionVersion, setExtensionVersion] = useState<string | null>(null);
  const hasCheckedExtension = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // We only accept messages from ourselves (the window) ensuring it's the bridge protocol
      if (event.source !== window) return;

      const data = event.data;
      if (!isBridgeMessage(data)) return;

      if (data.type === "EXTENSION_STATUS_RESPONSE") {
        setIsExtensionAvailable(data.payload.isInstalled);
        setExtensionVersion(data.payload.version);
      }

      // Handle other messages if needed, e.g. AUTH_STATE_SYNCED
    };

    window.addEventListener("message", handleMessage);

    // Initial Ping - only send once
    if (!hasCheckedExtension.current) {
      hasCheckedExtension.current = true;
      window.postMessage(
        { type: "EXTENSION_STATUS_REQUEST" } as BridgeMessage,
        window.location.origin,
      );
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const sendMessage = useCallback((message: BridgeMessage) => {
    window.postMessage(message, window.location.origin);
  }, []);

  return (
    <ExtensionBridgeContext.Provider
      value={{
        isExtensionAvailable,
        extensionVersion,
        sendMessage,
      }}
    >
      {children}
    </ExtensionBridgeContext.Provider>
  );
}

export const useExtensionBridge = () => useContext(ExtensionBridgeContext);
