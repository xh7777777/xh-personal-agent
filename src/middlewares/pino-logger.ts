import { pinoLogger } from "hono-pino";
import PinoPretty from "pino-pretty";
import pino from "pino";
import env from "@/utils/load-env.js";

export function getPinoLogger() {
  return pinoLogger({
    pino: pino(
      {
        level: env.NODE_ENV === "development" ? "debug" : "info",
      },
      env.NODE_ENV === "development" ? PinoPretty() : undefined,
    ),
  });
}
