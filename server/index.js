const express= require('express');
const slidingWinRateLimiter = require('./middleware/slidingWindow');

const app = express();
const PORT =process.env.port ||3000;

const cors=require('cors');
app.use(cors({
    origin: 'http://localhost:3002', //frontend port
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining']
}));

app.use(slidingWinRateLimiter);

app.get('/', (req,res)=> {
    res.json({
        message: 'Request Allowed :)',
        remaining: res.locals.remaining,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});