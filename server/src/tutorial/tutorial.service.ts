import { Injectable } from '@nestjs/common';
import { HandlerService } from 'src/common/service/handler.service';

@Injectable()
export class TutorialService implements HandlerService {
  execute(callerId: string): any {
    const WAM_NAME = 'ExampleBot';
    return {
      message: `Tutorial executed by ${WAM_NAME} for callerId: ${callerId}`,
    };
  }
}
