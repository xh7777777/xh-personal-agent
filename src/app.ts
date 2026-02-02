import createApp from "@/lib/create-app.js";
import configureOpenAPI from "@/lib/configure-open-api.js";
import router from "@/routes/index.route.js";
import tasks from "@/routes/tasks/tasks.index.js"

const routes = [router, tasks];

const app = createApp();
configureOpenAPI(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
