import { createRouter } from "@/lib/create-app.js";
import * as handlers from "./agent.handler.js";
import * as routes from "./agent.routes.js";

const router = createRouter().openapi(
  routes.testAgentConnect,
  handlers.testAgentConnectHandler,
);

export default router;
