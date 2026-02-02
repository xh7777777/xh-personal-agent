import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(dotenv.config());

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
}
catch (error) {
  console.error("Environment variable validation failed:", error);
  process.exit(1);
}

export default env;
