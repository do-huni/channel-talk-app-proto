import {
  BaseFunctionInput,
  BaseFunctionOutput,
} from 'src/common/interfaces/function.interface';

export class TutorialInput extends BaseFunctionInput {
  message: string;
}

export class TutorialOutput extends BaseFunctionOutput {}
