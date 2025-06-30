import Koa, { Context, Next } from 'koa';
import bodyParser from 'koa-bodyparser';
import './load-env';
import sequelize from './lib/models/connection';
import routes from './lib/routes';
import { auth } from './lib/middleware/auth';

const app: Koa = new Koa();

app.use(bodyParser());

app.use(async (ctx: Context, next: Next) => {
    if (ctx.path === '/health') {
        ctx.body = { status: 'ok' };
        return;
    }
    await next();
});

app.use(auth(process.env.JWT_SECRET!));
app.use(routes.routes());
app.use(routes.allowedMethods());

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');
    } catch (err) {
        console.error('❌ DB sync error:', err);
        process.exit(1);
    }
})();

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Listening on http://localhost:${PORT}/`);
});