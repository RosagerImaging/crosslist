import { useEffect, useState, useCallback } from 'react';
import {
  BridgeMessage,
  isBridgeMessage,
  ExtensionStatusResponseMessage,
} from '@crosslist/shared';

export function useExtensionBridge() {
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [extensionVersion, setExtensionVersion] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // We only accept messages from ourselves (the window) ensuring it's the bridge protocol
      if (event.source !== window) return;

      const message = event.data;
      if (!isBridgeMessage(message)) return;

      if (message.type === 'EXTENSION_STATUS_RESPONSE') {
        setIsExtensionAvailable(message.payload.isInstalled);
        setExtensionVersion(message.payload.version);
      }
      
      // Handle other messages if needed, e.g. AUTH_STATE_SYNCED
    };

    window.addEventListener('message', handleMessage);

    // Initial Ping
    // We send a message that the content script (if present) should reply to
    window.postMessage({ type: 'EXTENSION_STATUS_REQUEST' } as BridgeMessage, window.location.origin);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendMessage = useCallback((message: BridgeMessage) => {
    // Determine target origin. For the bridge (Web App -> Content Script), 
    // we communicate within the same window, so window.location.origin is appropriate.
    // However, if the extension is injecting into a different domain, this might need adjustment.
    // Assuming Web App is the host.
    window.postMessage(message, window.location.origin);
  }, []);

  return {
    isExtensionAvailable,
    extensionVersion,
    sendMessage,
  };
}
