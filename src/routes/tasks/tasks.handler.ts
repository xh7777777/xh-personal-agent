import db from "@/db/index.js";
import { tasks } from "@/db/schema.js";
import { eq } from "drizzle-orm";
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from "./tasks.routes.js";
import type { AppRouteHandler } from "@/lib/types.js";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const taskList = await db.query.tasks.findMany();
  return c.json(taskList);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
  });

  if (!task) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json(task, 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const inserted = await db.insert(tasks).values(task).$returningId();
  const insertedId = inserted[0]?.id;

  if (!insertedId) {
    throw new Error("Failed to create task");
  }

  const createdTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, insertedId),
  });

  if (!createdTask) {
    throw new Error("Created task could not be loaded");
  }

  return c.json(createdTask, 200);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const existingTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
  });

  if (!existingTask) {
    return c.json({ error: "Task not found" }, 404);
  }

  const hasUpdates = Object.keys(updates).length > 0;

  if (hasUpdates) {
    await db.update(tasks).set(updates).where(eq(tasks.id, id));
  }

  const payload = {
    title: updates.title ?? existingTask.title,
    description:
      typeof updates.description !== "undefined"
        ? updates.description
        : existingTask.description,
  };

  return c.json(payload, 200);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const existingTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
  });

  if (!existingTask) {
    return c.json({ error: "Task not found" }, 404);
  }

  await db.delete(tasks).where(eq(tasks.id, id));

  return c.body(null, 204);
}
