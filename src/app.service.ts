import { Injectable } from '@nestjs/common';

@Injectable()
export default class {
  readonly hello = 'hello world';

  getHello(): string {
    return this.hello;
  }
}
