import Redis from "ioredis";


const redisClient = new Redis({
    host:'redis-17210.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
    port:17210,
    password:'Ftz9tUAhFGDK2jboQkrCzkLLAk7GiWA2'
});

redisClient.on('connect',()=>{
    console.log('redish connect succussfully')
    
})

export default redisClient;