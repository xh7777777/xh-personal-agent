import { createRouter } from "@/lib/create-app.js";
import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";
import * as HttpStatusCodes from "stoker/http-status-codes"

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(z.object({ message: z.string() }), "Hello, world!"),
    },
  }),
  (c) => {
    return c.json({ message: "Hello, world!" });
  }
);

export default router;
