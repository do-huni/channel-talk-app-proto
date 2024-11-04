import { FunctionRequest } from 'src/common/interfaces/function.interface';

export interface HandlerService<T> {
  execute(body: FunctionRequest<T>): Promise<any> | any;
}
