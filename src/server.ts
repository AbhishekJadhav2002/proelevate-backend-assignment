import express from 'express';
import { connectDatabase } from './configs';
import middlewares from './middlewares';
import router from './routes';
import { connectRedis } from './services';
import { gracefulShutdown } from './utils/security.utils';

let app = express();

app = middlewares(app);

app.use(router);

app.listen(process.env.PORT || 3000, async () => {
	try {
		await connectDatabase();
		await connectRedis();
		console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
	} catch (error) {
		await gracefulShutdown();
	}
});
