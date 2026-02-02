import createApp from "@/lib/create-app.js";
import configureOpenAPI from "@/lib/configure-open-api.js";
import router from "@/routes/index.route.js";
import tasks from "@/routes/tasks/tasks.index.js";
import agent from "@/routes/agentAPIs/agent.index.js";

const routes = [router, tasks, agent];

const app = createApp();
configureOpenAPI(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
