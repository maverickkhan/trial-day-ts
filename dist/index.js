"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
require("./load-env");
const connection_1 = __importDefault(require("./lib/models/connection"));
const routes_1 = __importDefault(require("./lib/routes"));
const auth_1 = require("./lib/middleware/auth");
const app = new koa_1.default();
app.use((0, koa_bodyparser_1.default)());
app.use(async (ctx, next) => {
    if (ctx.path === '/health') {
        ctx.body = { status: 'ok' };
        return;
    }
    await next();
});
app.use((0, auth_1.auth)(process.env.JWT_SECRET));
app.use(routes_1.default.routes());
app.use(routes_1.default.allowedMethods());
(async () => {
    try {
        await connection_1.default.sync({ alter: true });
        console.log('✅ Database synced');
    }
    catch (err) {
        console.error('❌ DB sync error:', err);
        process.exit(1);
    }
})();
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Listening on http://localhost:${PORT}/`);
});
