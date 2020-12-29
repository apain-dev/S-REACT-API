"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envSchema = {
    id: '/Env',
    type: 'object',
    properties: {
        PORT: { type: 'string' },
        MONGO_DATABASE: { type: 'string' },
        OAUTH_API: { type: 'string' },
        CLIENT_SECRET: { type: 'string' },
        CLIENT_ID: { type: 'string' },
        UPLOAD_LIMIT: { type: 'string' },
        UPLOAD_DIR: { type: 'string' },
        URL: { type: 'string' },
        GMAPS_API_KEY: { type: 'string' },
        APP_URL: { type: 'string' },
        STRIPE_WEBHOOKS_KEY: { type: 'string' },
        STRIPE_PRIVATE_KEY: { type: 'string' },
        POSTMARK_API_KEY: { type: 'string' },
    },
    required: ['PORT', 'MONGO_DATABASE', 'CLIENT_SECRET', 'CLIENT_ID', 'UPLOAD_LIMIT', 'UPLOAD_DIR', 'URL',
        'GMAPS_API_KEY', 'APP_URL', 'STRIPE_WEBHOOKS_KEY', 'STRIPE_PRIVATE_KEY', 'POSTMARK_API_KEY'],
};
exports.default = envSchema;
//# sourceMappingURL=env.schema.js.map