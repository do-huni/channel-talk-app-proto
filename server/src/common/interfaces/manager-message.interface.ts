export class ManagerSendMessageRequest {
  method: string = 'sendAsBot';
  params: SendAsBotParams;
  context: BotContext;
}

interface SendAsBotParams {
  groupId: number;
  rootMessageId?: number;
  broadcast: boolean;
}

interface BotContext {
  channel: {
    id: number;
  };
  caller: null;
}
