import { Injectable } from '@nestjs/common';
import { CommandRequest } from 'src/common/interfaces/function.interface';
import { HandlerService } from 'src/common/service/handler.service';
import { TutorialInput } from 'src/tutorial/tutorial.input';

export const TUTORIAL = 'tutorial';

@Injectable()
export class TutorialService implements HandlerService<TutorialInput> {
  execute(body: CommandRequest<TutorialInput>) {
    return body;
  }
}
