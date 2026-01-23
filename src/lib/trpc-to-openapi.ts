import { generateOpenApiDocument } from 'trpc-to-openapi';
import { appRouter } from '../trpc/router';

/* 👇 */
export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'tRPC OpenAPI',
    version: '1.0.0',
    baseUrl: 'http://localhost:3000'
});
