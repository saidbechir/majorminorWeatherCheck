const fastify = require("fastify")({ logger: true });
const fastifyEnv = require("fastify-env");

fastify.get("/", async (request, reply) => {
    return { hello: "world" };
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
    console.log("Escuchando el puerto 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
