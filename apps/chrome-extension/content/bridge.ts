/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { BridgeMessage, isBridgeMessage } from "@crosslist/shared";

console.log("Crosslist Bridge Content Script Loaded");

// Track if extension context is valid
let isExtensionValid = true;

// Helper to check if extension context is still valid
function checkExtensionContext(): boolean {
  if (!chrome.runtime?.id) {
    isExtensionValid = false;
    console.warn(
      "Bridge: Extension context invalidated. Please refresh the page.",
    );
    return false;
  }
  return true;
}

// Flag to indicate extension is ready (wait for body to exist)
function setExtensionFlag() {
  if (!checkExtensionContext()) return;

  try {
    const version = chrome.runtime.getManifest().version;
    document.body?.setAttribute("data-crosslist-extension-installed", version);
  } catch (error) {
    console.error("Bridge: Failed to set extension flag:", error);
    isExtensionValid = false;
  }
}

if (document.body) {
  setExtensionFlag();
} else {
  // Body doesn't exist yet, set it when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setExtensionFlag();
    });
  }
}

// 1. Listen for messages from the Web App (window)
window.addEventListener("message", async (event) => {
  // Security: Only accept messages from the same window (content script and page share the window object)
  if (event.source !== window) return;

  const message = event.data;

  // Validate it's a known bridge message
  if (!isBridgeMessage(message)) return;

  // Filter out messages that are clearly meant for the EXTENSION (requests)
  // We don't want to infinite loop on our own responses if we posted them back to window
  if (
    message.type === "AUTH_STATE_SYNCED" ||
    message.type === "EXTENSION_STATUS_RESPONSE"
  ) {
    return;
  }

  // Check if extension context is still valid before attempting communication
  if (!checkExtensionContext()) {
    return;
  }

  console.log("Bridge: Forwarding message to background:", message);

  try {
    // 2. Forward to Background Script
    const response = await chrome.runtime.sendMessage(message);

    // 3. Send Response back to Web App
    if (response) {
      console.log("Bridge: Received response from background:", response);
      window.postMessage(response, window.location.origin);
    }
  } catch (error) {
    // Check if this is an extension context invalidation error
    if (
      error instanceof Error &&
      (error.message.includes("Extension context invalidated") ||
        error.message.includes("message port closed"))
    ) {
      isExtensionValid = false;
      console.warn(
        "Bridge: Extension context invalidated. Please refresh the page after reloading the extension.",
      );
    } else {
      console.error("Bridge: Error communicating with background:", error);
    }
  }
});

// 4. Listen for messages from Background Script (relayed from other parts of extension)
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (isBridgeMessage(message)) {
    console.log("Bridge: Received message from background:", message);
    // Forward to Web App
    window.postMessage(message, window.location.origin);
  }
});
