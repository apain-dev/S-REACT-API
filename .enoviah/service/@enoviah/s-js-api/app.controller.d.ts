import AppService from './app.service';
declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
}
export default AppController;
