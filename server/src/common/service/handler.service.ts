import { CommandRequest } from 'src/common/interfaces/function.interface';

export interface HandlerService<T> {
  execute(body: CommandRequest<T>): Promise<any> | any;
}
