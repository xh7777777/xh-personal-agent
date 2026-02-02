import env from "./utils/load-env.js";
import { serve } from "@hono/node-server";
import app from "./app.js";

const port = env.PORT || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.warn(`
Server is running success on http://localhost:${info.port} 
redirect to http://localhost:3000/reference to see the OpenAPI docs
run npm run db:studio and redirect to https://local.drizzle.studio to see the database studio
current NODE_ENV: ${env.NODE_ENV}
current time: ${new Date().toISOString()}
`);
  },
);
