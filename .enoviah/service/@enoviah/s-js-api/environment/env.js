"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nest_core_1 = require("@enoviah/nest-core");
const env_schema_1 = require("./env.schema");
const environment = new nest_core_1.EnvironmentService();
environment.validators = env_schema_1.default;
environment.loadEnvironment(true);
exports.default = environment;
//# sourceMappingURL=env.js.map