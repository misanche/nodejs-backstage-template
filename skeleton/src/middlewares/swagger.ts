import * as express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import * as swaggerUI from 'swagger-ui-express';
import { readFileSync } from 'fs';
import * as YAML from 'js-yaml';
declare module 'express' {
    interface Request {
        requestId: string;
    }
}
// const isProd = (process.env.NODE_ENV === 'production');
function loadDocumentSync(file: string): any {
    return YAML.load(readFileSync(file, 'utf8'));
}
export const initSwaggerMiddlware = async function (app: express.Express, basePath: string, cb: any) {
    const swaggerDoc = loadDocumentSync(basePath + '/definition/swagger.yaml');
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    app.use(
        OpenApiValidator.middleware({
            apiSpec: basePath + '/definition/swagger.yaml',
            operationHandlers: basePath + '/routes',
            validateRequests: true, // (default)
            validateResponses: true, // false by default,
            validateFormats: 'full'
        })
    )
    cb();
};
