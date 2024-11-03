import { ApiProperty } from '@nestjs/swagger';

// Enum 객체들
export const ChatTypes = {
  GROUP: 'group',
  DIRECT_CHAT: 'directChat',
  USER_CHAT: 'userChat',
} as const;

export const ChatIds = {
  GROUP_ID: 'groupId',
  DIRECT_CHAT_ID: 'directChatId',
  USER_CHAT_ID: 'userChatId',
} as const;

export type ChatType = (typeof ChatTypes)[keyof typeof ChatTypes];
export type ChatId = (typeof ChatIds)[keyof typeof ChatIds];

export const CallerTypes = {
  USER: 'user',
  MANAGER: 'manager',
  APP: 'app',
} as const;

export type CallerType = (typeof CallerTypes)[keyof typeof CallerTypes];

export class Chat {
  @ApiProperty({ enum: ChatTypes })
  type: ChatType;

  @ApiProperty({ enum: ChatIds })
  id: ChatId;
}
export class Trigger {
  @ApiProperty()
  type: string;

  @ApiProperty()
  attributes: any;
}

export class Params<T = any> {
  @ApiProperty({ type: () => Chat })
  chat: Chat;

  @ApiProperty({ type: () => Trigger })
  trigger: Trigger;

  @ApiProperty()
  inputs: T;
}

export class Channel {
  @ApiProperty()
  id: number;
}

export class Caller {
  @ApiProperty({ enum: CallerTypes })
  type: CallerType;

  @ApiProperty()
  id: number;
}

export class Context {
  @ApiProperty({ type: () => Channel })
  channel: Channel;

  @ApiProperty({ type: () => Caller })
  caller: Caller;
}

export class CommandRequest<T> {
  @ApiProperty()
  readonly method: string;

  @ApiProperty({ type: () => Params<T> })
  params: Params<T>;

  @ApiProperty({ type: () => Context })
  context: Context;
}
