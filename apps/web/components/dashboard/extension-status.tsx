"use client";

import { useExtensionBridge } from "@/hooks/use-extension-bridge";

export function ExtensionStatus() {
  const { isExtensionAvailable, extensionVersion } = useExtensionBridge();

  if (isExtensionAvailable) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-200">
        <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
        <span className="font-medium">Extension Connected</span>
        <span className="text-xs opacity-75">(v{extensionVersion})</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm border border-amber-200">
      <span className="w-2 h-2 bg-amber-600 rounded-full" />
      <span className="font-medium">Extension Not Detected</span>
    </div>
  );
}
