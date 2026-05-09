import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'Smart AC Control API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        docs: 'API documentation available',
      },
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'smart-ac-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
