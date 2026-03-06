export interface MessageData {
  id: string;
  text: string;
  timestamp: string;
  isStarred?: boolean;
}

export interface ChatData {
  id: string;
  name: string;
  messages: MessageData[];
  timestamp: string;
}
