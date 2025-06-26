const express= require('express');
const slidingWinRateLimiter = require('./middleware/slidingWindow');

const app = express();
const PORT =process.env.port ||3000;

app.use(slidingWinRateLimiter);

app.get('/', (req,res)=> {
    res.send('Request allowed');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});