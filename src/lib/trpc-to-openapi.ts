import { generateOpenApiDocument, createOpenApiExpressMiddleware } from 'trpc-to-openapi';
import { appRouter } from '../trpc/router';
import {writeFile} from 'fs/promises'
/* 👇 */
export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'tRPC OpenAPI',
    version: '1.0.0',
    baseUrl: 'http://localhost:3000'
});


writeFile('openapi.json', JSON.stringify(openApiDocument))