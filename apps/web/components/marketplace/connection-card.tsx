"use client";

import { useState, useEffect, useCallback } from "react";
import { useExtensionBridge } from "../../hooks/use-extension-bridge";

interface MarketplaceConnectionCardProps {
  marketplace: "ebay" | "poshmark";
  initialStatus: boolean;
}

export function MarketplaceConnectionCard({
  marketplace,
  initialStatus,
}: MarketplaceConnectionCardProps) {
  const [isConnected, setIsConnected] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the bridge hook to listen for messages
  const { isExtensionAvailable } = useExtensionBridge();

  const handleConnect = useCallback(
    async (credentials: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/marketplace/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marketplace, credentials }),
        });

        if (!res.ok) throw new Error("Failed to connect");

        setIsConnected(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace],
  );

  useEffect(() => {
    // Listen for CREDENTIAL_CAPTURED messages
    const handleMessage = async (event: MessageEvent) => {
      if (event.source !== window) return;

      const message = event.data;
      if (
        message?.type === "CREDENTIAL_CAPTURED" &&
        message.payload?.marketplace === marketplace
      ) {
        console.log(`Received credentials for ${marketplace}`);
        // Close the popup window if we kept a reference?
        // We can't easily here without lifting state or refs, but we can verify the credential.

        await handleConnect(message.payload.credentials);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [marketplace, handleConnect]);

  const startConnectFlow = () => {
    if (!isExtensionAvailable) {
      setError("Extension not detected. Please install it first.");
      return;
    }

    setError(null);
    const url =
      marketplace === "ebay" ? "https://www.ebay.com" : "https://poshmark.com";
    // Open in new tab
    window.open(url, "_blank");

    // We expect the user to login there, and the extension will send a message back.
    // UI feedback
    setIsLoading(true);
    // Timeout to stop loading state if nothing happens?
    setTimeout(() => {
      if (!isConnected) setIsLoading(false); // Reset loading after 60s
    }, 60000);
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/marketplace/disconnect", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketplace }),
      });

      if (!res.ok) throw new Error("Failed to disconnect");

      setIsConnected(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-zinc-900">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold capitalize">{marketplace}</h3>
        {isConnected ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Connected
          </span>
        ) : (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Not Connected
          </span>
        )}
      </div>

      <div className="space-y-4">
        {isConnected ? (
          <button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
          >
            {isLoading ? "Disconnecting..." : "Disconnect"}
          </button>
        ) : (
          <button
            onClick={startConnectFlow}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Waiting for login..." : "Connect"}
          </button>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {!isExtensionAvailable && !isConnected && (
          <p className="text-amber-600 text-xs">Extension required</p>
        )}
      </div>
    </div>
  );
}
