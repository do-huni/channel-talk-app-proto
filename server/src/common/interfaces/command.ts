export type Command = {
  name: string;
  scope: string;
  description: string;
  actionFunctionName: string;
  alfMode: string;
  enabledByDefault: boolean;
};

export type RegisterCommandsParam = {
  appId: string;
  commands: Command[];
};
