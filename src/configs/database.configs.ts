import mongoose from 'mongoose';

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL as string, {
            maxPoolSize: 10,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Pinged. Connected to MongoDB!');
        mongoose.connection.on('disconnected', (err) => {
            console.log('❗ Mongoose default connection disconnected:', err);
            console.log('🔁 Trying to reconnect to Mongo...');
            setTimeout(
                async () =>
                    mongoose.connect(process.env.MONGO_URL as string, {
                        maxPoolSize: 10,
                        connectTimeoutMS: 3000,
                    }),
                3000,
            );
        });
    } catch (error) {
        console.log('❌ Error connecting to MongoDB:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

export default connectDatabase;
