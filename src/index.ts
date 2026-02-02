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
    console.warn(`Server is running on http://localhost:${info.port}`);
  },
);
