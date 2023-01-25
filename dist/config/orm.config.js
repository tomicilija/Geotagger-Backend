"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmModuleOptions = void 0;
const dotenv = require("dotenv");
dotenv.config({ path: `${process.env.NODE_ENV}.env` });
exports.typeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    migrationsTableName: 'migrations',
    migrations: ['dist/migrations/*.js'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};
exports.default = exports.typeOrmModuleOptions;
//# sourceMappingURL=orm.config.js.map