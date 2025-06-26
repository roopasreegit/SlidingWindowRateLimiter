const redisClient = require('./server/redisClient');

async function test(){
    try{
        await redisClient.set('test_key','Hi there!');
        const value=await redisClient.get('test_key');
        console.log('redis value:', value);
        process.exit(0);
    }catch(err){
        console.error('redis test error:', err);
        process.exit(1);
    }

}

test();