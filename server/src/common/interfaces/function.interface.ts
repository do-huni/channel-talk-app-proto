import { ApiProperty } from '@nestjs/swagger';

export const CallerTypes = {
  USER: 'user',
  MANAGER: 'manager',
  APP: 'app',
} as const;

export type CallerType = (typeof CallerTypes)[keyof typeof CallerTypes];

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

// 기본 파라미터 인터페이스
interface BaseParams {
  chat?: {
    type: string;
    id: string;
    // ... 필요한 chat 관련 필드들
  };
  trigger?: {
    type: string;
    attributes: object;
  };
  input?: object;
}

export class BaseFunctionRequest<T = any> {
  @ApiProperty()
  readonly method: string;

  @ApiProperty({ type: () => Object })
  params: BaseParams & T; // 기본 파라미터와 제네릭 타입을 합침

  @ApiProperty({ type: () => Context, required: false })
  context?: Context;
}

export class BaseFunctionInput {}

export class BaseFunctionError {
  @ApiProperty()
  type: string;

  @ApiProperty()
  message: string;
}

export class BaseFunctionOutput {}
export class GeneralFunctionOutput extends BaseFunctionOutput {
  @ApiProperty({ example: {} })
  result?: object;

  @ApiProperty({ type: () => BaseFunctionError })
  error?: BaseFunctionError;
}

export class WamAttributes {
  @ApiProperty({ description: 'app-tutorial의 app id' })
  appId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'object', properties: {} })
  wamArgs: { [key: string]: any };
}

export class WamFunctionResult {
  @ApiProperty({ example: 'wam' })
  type: 'wam';

  @ApiProperty({ type: () => WamAttributes })
  attributes: WamAttributes;
}

export class WamFunctionOutput extends BaseFunctionOutput {
  @ApiProperty({ type: () => WamFunctionResult })
  result?: WamFunctionResult;

  @ApiProperty({ type: () => BaseFunctionError })
  error?: BaseFunctionError;
}
