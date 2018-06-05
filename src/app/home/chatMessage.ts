export class ChatMessage {
  name: string;
  msg: string;
  time: Date;
  external: boolean;
  continuation: boolean;
  server: boolean;
  seen: boolean;
};
