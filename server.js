const fastify = require("fastify")({ logger: true });
const fastifyEnv = require("fastify-env");

const { isGreater } = require("./services/openWeatherMap.service");

fastify.get("/", async (request, reply) => {
  const result = await isGreater(request.query);
  reply.status(200).send(result);
});

const envSchema = {
    type: 'object',
    required: [ 'PORT' ],
    properties: {
      PORT: {
        type: 'string',
        default: 3000
      }
    }
  }

const envOptions = {
  confKey: "config", // optional, default: 'config'
  schema: envSchema,
  dotenv: true
};

const start = async () => {
  try {
    fastify.register(fastifyEnv, envOptions);
    await fastify.listen(3000);
    console.log("Listening on PORT 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
