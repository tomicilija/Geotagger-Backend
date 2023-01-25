"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const initSwagger = (app) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Guess the location')
        .setDescription('Guess the location API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
};
const initValidation = (app) => app.useGlobalPipes(new common_1.ValidationPipe({
    transform: true,
}));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    initSwagger(app);
    app.enableCors();
    initValidation(app);
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map