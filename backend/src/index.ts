import express from 'express';
import getResponse from './util/portfolio';
import path from 'path';
import cors from 'cors';
import { parseAsString } from 'parse-dont-validate';
import contactRouter from './router/contact';

const { static: expressStatic, json, urlencoded } = express;

(() => {
    const build = '../frontend/build';

    const app = (() => {
        const app = express();
        const port = process.env.PORT || 3000;

        const middleWares = [
            json({ limit: '10mb' }),
            urlencoded({ extended: true }),
            cors({
                origin: process.env.PUBLIC_URL,
                credentials: true,
            }),
            expressStatic(path.resolve(build)),
        ];

        app.use(middleWares);

        app.listen(port, () =>
            console.log(
                `🚀 Express listening at port ${port} 🚀 at time: ${new Date()}`
            )
        );
        return app;
    })();

    app.get('/api/portfolio', async (req, res) => {
        if (req.method !== 'GET') {
            throw new Error('Only accept GET request');
        } else {
            const { query } = req;
            res.status(200).json(
                await getResponse(
                    parseAsString(query.page).orElseLazyGet(() => '0'),
                    parseAsString(query.language).orElseLazyGet(() => 'All')
                )
            );
        }
    });

    contactRouter(app).sendEmail();

    app.get('*', (_, res) => res.sendFile(path.resolve(build, 'index.html')));
})();
