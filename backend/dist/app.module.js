"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const rooms_module_1 = require("./modules/rooms/rooms.module");
const air_conditioners_module_1 = require("./modules/air-conditioners/air-conditioners.module");
const brands_module_1 = require("./modules/brands/brands.module");
const sensor_module_1 = require("./modules/sensor/sensor.module");
const configs_module_1 = require("./modules/configs/configs.module");
const logs_module_1 = require("./modules/logs/logs.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const weather_module_1 = require("./modules/weather/weather.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            rooms_module_1.RoomsModule,
            air_conditioners_module_1.AirConditionersModule,
            brands_module_1.BrandsModule,
            sensor_module_1.SensorModule,
            configs_module_1.ConfigsModule,
            logs_module_1.LogsModule,
            schedules_module_1.SchedulesModule,
            dashboard_module_1.DashboardModule,
            weather_module_1.WeatherModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map