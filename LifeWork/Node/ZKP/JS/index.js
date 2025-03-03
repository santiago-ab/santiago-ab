import Redis from 'ioredis';

let client;

try {
  const redisOption = {
    offlineQueue: false,
    commandTimeout: 1500,
    connectTimeout: 1500,
    lazyConnect: false,
  };
  redisOption.username = 'default';
  redisOption.password = 'PWjXv4&cnnb3iLD2';

  client = new Redis(6379, 'master.smartwallet-waas-infra-api-redis-dev.fqjdpu.euw1.cache.amazonaws.com', redisOption);

  client.on('error', (err) => {
  });

  client.on('connect', () => {
  });
} catch (error) {
  throw new Error(`Error creating Redis Client: ${error}`);
}

const flushAll = async () => {
  const respo = await client.get("rate-limit:santiago.martinez@brillion.finance")
  console.log('respo :>> ', respo);
  // client.keys('rate-limit:santiago.martinez@brillion.finance', async (err, keys) => {
  //   console.log(' keys :>> ',  keys);
  //   if (keys && keys.length > 0) {
  //     await client.del(...keys);
  //   }
  // })
}
flushAll();