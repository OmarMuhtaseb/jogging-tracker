import {Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {
    @Get('health-check')
    healthCheck(): {'health-check': string} {
        return {'health-check': 'success'};
    }
}
