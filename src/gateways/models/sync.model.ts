export interface ChatStatus {
  _id: string;
  online: boolean;
}

export interface SyncPreConnect {
  userId: string;
  shopId: string;
}

export interface ChatTyping {
  from: string;
  to: string;
  typing: boolean;
}

export interface ChatMessage {
  conversation: string;
}
