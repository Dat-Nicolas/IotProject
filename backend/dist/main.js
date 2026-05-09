"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.enableCors();
    app.use((req, res, next) => {
        if (req.path === '/favicon.ico') {
            res.status(204).send();
        }
        else {
            next();
        }
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const apiPrefix = configService.get('API_PREFIX', 'api');
    app.setGlobalPrefix(apiPrefix);
    const port = configService.get('PORT', 3000);
    const host = configService.get('HOST', '0.0.0.0');
    await app.listen(port, host);
    logger.log(`Server listening on http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map