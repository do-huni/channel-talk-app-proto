export interface HandlerService {
  execute(...args: any[]): Promise<any> | any;
}
