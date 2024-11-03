export interface RequestInterface {
  method: string;
  params: Params;
  context: Context;
}

interface Params<T = any> {
  chat: Chat;
  trigger: Trigger;
  inputs: T;
}

interface Chat {
  type: ChatType;
  id: ChatId;
}

interface Context {
  channel: Channel;
  caller: Caller;
}

interface Trigger {
  type: string;
  attributes: any;
}

const ChatTypes = {
  GROUP: 'group',
  DIRECT_CHAT: 'directChat',
  USER_CHAT: 'userChat',
} as const;

const ChatIds = {
  GROUP_ID: 'groupId',
  DIRECT_CHAT_ID: 'directChatId',
  USER_CHAT_ID: 'userChatId',
} as const;

type ChatType = (typeof ChatTypes)[keyof typeof ChatTypes];
type ChatId = (typeof ChatIds)[keyof typeof ChatIds];

interface Channel {
  id: number;
}

interface Caller {
  type: CallerType;
  id: number;
}

const CallerTypes = {
  USER: 'user',
  MANAGER: 'manager',
  APP: 'app',
};

type CallerType = (typeof CallerTypes)[keyof typeof CallerTypes];
