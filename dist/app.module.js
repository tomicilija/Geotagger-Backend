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
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const orm_config_1 = require("./config/orm.config");
const locations_entity_1 = require("./entities/locations.entity");
const users_entity_1 = require("./entities/users.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const location_module_1 = require("./modules/location/location.module");
const guess_module_1 = require("./modules/guess/guess.module");
const guesses_entity_1 = require("./entities/guesses.entity");
const user_module_1 = require("./modules/user/user.module");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `${process.env.NODE_ENV}.env`,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => orm_config_1.default,
            }),
            typeorm_1.TypeOrmModule.forFeature([users_entity_1.Users, locations_entity_1.Locations, guesses_entity_1.Guesses]),
            auth_module_1.AuthModule,
            location_module_1.LocationModule,
            guess_module_1.GuessModule,
            user_module_1.UserModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useClass: common_1.ValidationPipe,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map