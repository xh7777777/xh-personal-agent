import type { TestAgentConnectRoute } from "./agent.routes.js";
import type { AppRouteHandler } from "@/lib/types.js";
import { qwenTurbo } from "@/agent/example.js";

export const testAgentConnectHandler: AppRouteHandler<
  TestAgentConnectRoute
> = async (c) => {
  const response = await qwenTurbo.invoke("hello, world!");

  console.warn("Agent response:", response);

  if (!response) {
    return c.json({ message: "Failed to connect to agent" }, 500);
  }

  return c.json({
    message: `Agent connected successfully, get response: ${response.content}`,
  });
};
