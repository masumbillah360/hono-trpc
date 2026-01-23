import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { OpenApiMeta } from 'trpc-to-openapi';
const t = initTRPC.meta<OpenApiMeta>().create(); /* 👈 */

const publicProcedure = t.procedure;
const router = t.router;

const allSchema = z.object({
    id: z.number(),
    name: z.string().trim()
})
export const appRouter = router({
    hi: publicProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/hi',
            },
        })
        .output(z.string())
        .query(() => {
            return `Hi`;
        }),
    hello: publicProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/hello',
            },
        })
        .input(
            z.object({
                name: z.string().nullish(),
            }),
        )
        .output(z.string())
        .query(({ input }) => {
            return `Hello ${input.name ?? 'World'}!`;
        }),
    all: publicProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/all',
            },
        })
        .output(z.array(allSchema))
        .query(() => {
            return [{ id: 1, name: 'Hello' }];
        }),
});

export type AppRouter = typeof appRouter;
