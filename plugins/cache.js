const { isGreater } = require("../services/openWeatherMap.service");

const cache = async (fastify, options, done) => {
  const cache = new Map();

  fastify.get("/", async (request, reply) => {
    const result = await isGreater(request.query, cache);
    reply.status(200).send(result);
  });

  // TODO - Define a CRON to clean cache

  done();
};

module.exports = cache;