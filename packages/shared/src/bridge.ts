import { Session } from '@supabase/supabase-js';

// Message Types
export type AuthStateSyncMessage = {
  type: 'AUTH_STATE_SYNC';
  payload: {
    session: Session | null;
  };
};

export type AuthStateSyncedMessage = {
  type: 'AUTH_STATE_SYNCED';
  payload: {
    success: boolean;
    error?: string;
  };
};

export type ExtensionStatusRequestMessage = {
  type: 'EXTENSION_STATUS_REQUEST';
};

export type ExtensionStatusResponseMessage = {
  type: 'EXTENSION_STATUS_RESPONSE';
  payload: {
    isInstalled: boolean;
    version: string;
  };
};

export type BridgeMessage =
  | AuthStateSyncMessage
  | AuthStateSyncedMessage
  | ExtensionStatusRequestMessage
  | ExtensionStatusResponseMessage;

// Type Guards
export function isBridgeMessage(message: any): message is BridgeMessage {
  if (!message || typeof message !== 'object') return false;
  return (
    message.type === 'AUTH_STATE_SYNC' ||
    message.type === 'AUTH_STATE_SYNCED' ||
    message.type === 'EXTENSION_STATUS_REQUEST' ||
    message.type === 'EXTENSION_STATUS_RESPONSE'
  );
}

export function isAuthStateSyncMessage(message: any): message is AuthStateSyncMessage {
  return isBridgeMessage(message) && message.type === 'AUTH_STATE_SYNC';
}

export function isAuthStateSyncedMessage(message: any): message is AuthStateSyncedMessage {
  return isBridgeMessage(message) && message.type === 'AUTH_STATE_SYNCED';
}
