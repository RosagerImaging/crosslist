/**
 * @deprecated This hook is now a re-export from ExtensionBridgeProvider.
 * The provider ensures only ONE instance sends EXTENSION_STATUS_REQUEST,
 * preventing message spam when multiple components use this hook.
 *
 * All components should continue using useExtensionBridge() - no changes needed.
 * The provider is automatically included in the root layout.
 */
export { useExtensionBridge } from "@/components/providers/extension-bridge-provider";
