import type { AppOpenAPI } from "./types.js";
import packageJSON from "../../package.json" with { type: "json" };
import { Scalar } from "@scalar/hono-api-reference";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "API Documentation",
      description: "This is the API documentation for the application."
    },
  })

  app.get("/reference", Scalar({
    url: "/doc",
    theme: "purple",
    defaultHttpClient: {
      targetKey: "js",
      clientKey: "axios"
    }
  }))
}
