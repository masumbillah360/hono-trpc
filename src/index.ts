import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { appRouter } from './trpc/router';
import { openApiDocument } from './lib/trpc-to-openapi';
import { validator as zValidator, resolver, describeRoute, openAPIRouteHandler } from 'hono-openapi';
import z from 'zod';

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
app.get(
    '/hi',
    describeRoute({
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: resolver(z.string()),
                    },
                },
            },
        },
    }),
    zValidator('query', z.object({
      name: z.string()
    })),
    (c) => {
        const query = c.req.valid('query');
        return c.text(`Hello ${query?.name ?? 'Hono'}!`);
    },
);

app.get(
    '/hon-openapi.json',
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: 'Hono',
                version: '1.0.0',
                description: 'API for greeting users',
            },
        },
    }),
);

export default app;
