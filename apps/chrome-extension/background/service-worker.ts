/* eslint-disable no-unused-vars */
import "../background/cookies-spike";
import { encrypt } from "../services/encryption";
import {
  AuthStateSyncMessage,
  AuthStateSyncedMessage,
  isAuthStateSyncMessage,
} from "@crosslist/shared";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Crosslist extension installed.");
});

chrome.runtime.onMessage.addListener(
  (
    message: { type: string; payload?: unknown },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (_response?: unknown) => void,
  ) => {
    console.log("Received internal message:", message);

    // Handle Auth State Sync
    if (isAuthStateSyncMessage(message)) {
      handleAuthStateSync(message, sendResponse);
      return true; // async response
    }

    // Handle Extension Status Request (Ping)
    if (
      message &&
      typeof message === "object" &&
      message.type === "EXTENSION_STATUS_REQUEST"
    ) {
      sendResponse({
        type: "EXTENSION_STATUS_RESPONSE",
        payload: {
          isInstalled: true,
          version: chrome.runtime.getManifest().version,
        },
      });
      return;
    }

    // Handle Credential Capture Request
    if (message.type === "CAPTURE_MARKETPLACE_SESSION") {
      handleCredentialCapture(message);
      return true;
    }
  },
);

async function handleCredentialCapture(message: {
  payload: { marketplace: "ebay" | "poshmark" };
}) {
  try {
    const { marketplace } = message.payload;
    let domain = "";

    if (marketplace === "ebay") domain = "ebay.com";
    else if (marketplace === "poshmark") domain = "poshmark.com";

    // Get all cookies for the domain
    const cookies = await chrome.cookies.getAll({ domain });

    if (cookies.length === 0) {
      console.log(`No cookies found for ${marketplace}`);
      // Find Web App tabs and notify failure?
      return;
    }

    // Encrypt the cookies
    const credentialData = JSON.stringify(cookies);
    const encryptedData = await encrypt(credentialData);

    // Send to Web App tabs
    // We look for tabs matching our allowed origins
    const tabs = await chrome.tabs.query({});
    const webAppTabs = tabs.filter(
      (t) =>
        t.url &&
        (t.url.startsWith("http://localhost:3000") ||
          t.url.startsWith("https://crosslist.app")),
    );

    for (const tab of webAppTabs) {
      if (tab.id) {
        chrome.tabs
          .sendMessage(tab.id, {
            type: "CREDENTIAL_CAPTURED", // Matches interface in context
            payload: {
              marketplace,
              credentials: encryptedData,
            },
          })
          .catch(() => {
            // Tab might be closed or not ready
          });
      }
    }

    console.log(
      `Sent encrypted credentials for ${marketplace} to ${webAppTabs.length} tabs.`,
    );
  } catch (error) {
    console.error("Error capturing credentials:", error);
  }
}

async function handleAuthStateSync(
  message: AuthStateSyncMessage,
  sendResponse: (response: AuthStateSyncedMessage) => void,
) {
  try {
    const { session } = message.payload;

    if (session) {
      const serializedSession = JSON.stringify(session);
      const encryptedSession = await encrypt(serializedSession);

      await chrome.storage.local.set({
        supabase_session_encrypted: encryptedSession,
        auth_last_synced: Date.now(),
      });
      console.log("Session encrypted and stored.");
    } else {
      await chrome.storage.local.remove([
        "supabase_session_encrypted",
        "auth_last_synced",
      ]);
      console.log("Session cleared.");
    }

    sendResponse({
      type: "AUTH_STATE_SYNCED",
      payload: { success: true },
    });
  } catch (error) {
    console.error("Error syncing auth state:", error);
    sendResponse({
      type: "AUTH_STATE_SYNCED",
      payload: {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
