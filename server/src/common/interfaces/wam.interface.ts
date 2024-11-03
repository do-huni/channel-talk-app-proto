import { IsIn, IsNumber, IsObject } from 'class-validator';

export class WamRequest {
  method: string;
  params: null;
  context: Context;
}

class Caller {
  @IsIn(['manager'], { message: 'Caller type must be manager' })
  type: string;

  @IsNumber()
  id: number;
}

class Context {
  @IsObject()
  caller: Caller;
}
