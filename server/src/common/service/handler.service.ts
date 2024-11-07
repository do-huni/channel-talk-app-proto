import {
  BaseFunctionInput,
  BaseFunctionOutput,
  BaseFunctionRequest,
} from 'src/common/interfaces/function.interface';

export interface HandlerService<
  T extends BaseFunctionInput,
  O extends BaseFunctionOutput,
> {
  execute(body: BaseFunctionRequest<T>): Promise<O> | O;
}
