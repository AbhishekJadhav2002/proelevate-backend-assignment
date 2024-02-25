import { createClient } from 'redis';

const redisClient: ReturnType<typeof createClient> = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', async (error: any) => {
    console.log('❗ Error on Redis:', error);
    await redisClient.quit();
    process.exit(1);
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('✅ Redis connected!');
    } catch (error) {
        console.log('❌ Error connecting to Redis:', error);
        process.exit(1);
    }
}

async function getAsync(key: string) {
    const value = await redisClient.get(key);
    return value;
}

async function setAsync(key: string, value: string, expiry: number = 10000) {
    await redisClient.set(key, value, { EX: expiry });
}

async function removeAsync(key: string) {
    await redisClient.del(key);
}

export default connectRedis;
export { getAsync, redisClient, removeAsync, setAsync };
