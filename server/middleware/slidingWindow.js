const redisClient = require('../redisClient');

const WINDOW_SIZE_IN_HOURS=1;
const MAX_REQUESTS=100;
const BUCKET_SIZE_IN_SECONDS=60;

function getCurrentBucket(){
    const currentTime = Math.floor(Date.now()/1000);
    return Math.floor(currentTime/BUCKET_SIZE_IN_SECONDS);
}

async function slidingWindowRateLimiter (req,res,next){
    const userId= req.ip;
    const key= `rate_limit:${userId}`;
    const currentBucket=getCurrentBucket();
    const currentTime = Math.floor(Date.now()/1000);

    try{

        const buckets = await redisClient.hGetAll(key);

        let totalRequests=0;
        const now = Date.now()/1000; //to convert ms to s divide by 1000

        for(const bucket in buckets){  //Object.entries() converts redis data format from {"":""} to {["",""]}
            const count = buckets[bucket];

            if(currentTime - (bucket * BUCKET_SIZE_IN_SECONDS)<WINDOW_SIZE_IN_HOURS*3600){
                totalRequests+= parseInt(count,10); //parseInt to convert count which is returned by redis in string format. 10 is the base.
            }
        }

        if(totalRequests>=MAX_REQUESTS){
            return res.status(429).json({message:'Rate limit exceeded'});
        }

        //if not exceede increment count of curr bucket
        await redisClient.hIncrBy(key, String(currentBucket),1);

        // setting expiry time (time to live -TTL) on the redis hash key
        await redisClient.expire(key,(WINDOW_SIZE_IN_HOURS*3600)+60); //1 extra min buffer

        next(); //moving outta the middleware

    }catch(err){
        console.error('Rate limiter error :(', err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports= slidingWindowRateLimiter;