const {createClient} = require('redis');
require('dotenv').config();

const redisClient= createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis client error', err));

redisClient.connect()
    .then(() => console.log('Connected to redis'))
    .catch((err) => console.error('Redis connection failed', err));

module.exports = redisClient;