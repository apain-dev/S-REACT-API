import { Injectable } from '@nestjs/common';

@Injectable()
class AppService {
  readonly message = 'hello';

  getHello(): string {
    return this.message;
  }
}

export default AppService;
