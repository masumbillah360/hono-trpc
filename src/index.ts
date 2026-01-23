import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { appRouter } from './trpc/router';
import { openApiDocument } from './lib/trpc-to-openapi';

const app = new Hono();

app.use(logger());
app.use(
    cors({
        origin: '*',
    }),
);

app.use('*', requestId());
app.use(compress());

app.use(
    '/trpc/*',
    trpcServer({
        router: appRouter,
    }),
);

app.get('/openapi.json', (c)=>{
  return c.json(openApiDocument);
})
app.get('/', (c) => {
    return c.json({
        success: true,
        message: 'Server is up and running...',
    });
});

export default app;
