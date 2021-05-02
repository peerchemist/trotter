"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const auth_middleware_1 = require("./middleware/auth.middleware");
const networks_middleware_1 = require("./middleware/networks.middleware");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new logger_1.TrotterLogger()
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Trotter NFT API.')
        .setDescription('Trotter does abstraction on creation of NFT tokens on multiple EVM-based blockchain networks.')
        .setVersion('0.1')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(auth_middleware_1.auth, networks_middleware_1.validateNetwork);
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map