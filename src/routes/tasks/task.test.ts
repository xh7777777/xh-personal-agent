import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { AppOpenAPI } from "@/lib/types.js";

const findManyMock = vi.fn();
const findFirstMock = vi.fn();
const insertMock = vi.fn();
const insertValuesMock = vi.fn();
const returningIdMock = vi.fn();
const updateMock = vi.fn();
const updateSetMock = vi.fn();
const updateWhereMock = vi.fn();
const deleteMock = vi.fn();
const deleteWhereMock = vi.fn();

vi.mock("@/middlewares/pino-logger.js", () => ({
  getPinoLogger: () => async (_c: unknown, next?: () => Promise<void>) => {
    if (next)
      await next();
  },
}));

vi.mock("@/db/index.js", () => {
  insertMock.mockImplementation(() => ({
    values: (...args: unknown[]) => {
      insertValuesMock(...args);
      return {
        $returningId: returningIdMock,
      };
    },
  }));

  updateMock.mockImplementation(() => ({
    set: (...args: unknown[]) => {
      updateSetMock(...args);
      return {
        where: (...whereArgs: unknown[]) => updateWhereMock(...whereArgs),
      };
    },
  }));

  deleteMock.mockImplementation(() => ({
    where: (...args: unknown[]) => deleteWhereMock(...args),
  }));

  return {
    default: {
      query: {
        tasks: {
          findMany: (...args: unknown[]) => findManyMock(...args),
          findFirst: (...args: unknown[]) => findFirstMock(...args),
        },
      },
      insert: (...args: unknown[]) => insertMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
      delete: (...args: unknown[]) => deleteMock(...args),
    },
  };
});

let router: AppOpenAPI;

beforeAll(async () => {
  router = (await import("./tasks.index.js")).default;
});

const jsonHeaders = {
  "content-type": "application/json",
};

beforeEach(() => {
  findManyMock.mockReset();
  findFirstMock.mockReset();
  returningIdMock.mockReset();
  insertValuesMock.mockReset();
  updateSetMock.mockReset();
  updateWhereMock.mockReset();
  deleteWhereMock.mockReset();
  insertMock.mockClear();
  updateMock.mockClear();
  deleteMock.mockClear();

  returningIdMock.mockResolvedValue([{ id: 1 }]);
  updateWhereMock.mockResolvedValue(undefined);
  deleteWhereMock.mockResolvedValue(undefined);
});

describe("tasks routes", () => {
  it("returns a list of tasks", async () => {
    const taskList = [
      {
        id: 1,
        title: "Ship product",
        description: "Finish release",
        status: 0,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    findManyMock.mockResolvedValue(taskList);

    const response = await router.request("/tasks");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(taskList);
    expect(findManyMock).toHaveBeenCalledTimes(1);
  });

  it("returns task details when present", async () => {
    const task = {
      id: 7,
      title: "Investigate",
      description: "Look into bug",
      status: 0,
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    };
    findFirstMock.mockResolvedValue(task);

    const response = await router.request("/tasks/7");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(task);
    expect(findFirstMock).toHaveBeenCalledTimes(1);
  });

  it("returns 404 when task does not exist", async () => {
    findFirstMock.mockResolvedValue(null);

    const response = await router.request("/tasks/9");
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Task not found" });
  });

  it("creates a task", async () => {
    const payload = { title: "Test", description: "Write tests" };
    const createdTask = {
      id: 10,
      title: payload.title,
      description: payload.description,
      status: 0,
      createdAt: "2024-01-03T00:00:00.000Z",
      updatedAt: "2024-01-03T00:00:00.000Z",
    };

    returningIdMock.mockResolvedValue([{ id: createdTask.id }]);
    findFirstMock.mockResolvedValue(createdTask);

    const response = await router.request("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: jsonHeaders,
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(createdTask);
    expect(insertValuesMock).toHaveBeenCalledWith(payload);
  });

  it("patches a task and merges values", async () => {
    const existingTask = {
      id: 3,
      title: "Original",
      description: "Keep description",
      status: 0,
      createdAt: "2024-01-04T00:00:00.000Z",
      updatedAt: "2024-01-04T00:00:00.000Z",
    };

    findFirstMock.mockResolvedValue(existingTask);

    const response = await router.request("/tasks/3", {
      method: "PATCH",
      body: JSON.stringify({ title: "Updated" }),
      headers: jsonHeaders,
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      title: "Updated",
      description: existingTask.description,
    });
    expect(updateSetMock).toHaveBeenCalledWith({ title: "Updated" });
  });

  it("returns existing fields when patch payload is empty", async () => {
    const existingTask = {
      id: 5,
      title: "Keep",
      description: "Keep",
      status: 0,
      createdAt: "2024-01-05T00:00:00.000Z",
      updatedAt: "2024-01-05T00:00:00.000Z",
    };

    findFirstMock.mockResolvedValue(existingTask);

    const response = await router.request("/tasks/5", {
      method: "PATCH",
      body: JSON.stringify({}),
      headers: jsonHeaders,
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      title: existingTask.title,
      description: existingTask.description,
    });
    expect(updateSetMock).not.toHaveBeenCalled();
    expect(updateWhereMock).not.toHaveBeenCalled();
  });

  it("returns 404 for patch when task is missing", async () => {
    findFirstMock.mockResolvedValue(null);

    const response = await router.request("/tasks/2", {
      method: "PATCH",
      body: JSON.stringify({ title: "Nope" }),
      headers: jsonHeaders,
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Task not found" });
  });

  it("deletes a task when it exists", async () => {
    findFirstMock.mockResolvedValue({
      id: 11,
      title: "Delete me",
      description: "Unused",
      status: 0,
      createdAt: "2024-01-06T00:00:00.000Z",
      updatedAt: "2024-01-06T00:00:00.000Z",
    });

    const response = await router.request("/tasks/11", {
      method: "DELETE",
    });

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(deleteWhereMock).toHaveBeenCalledTimes(1);
  });

  it("returns 404 when deleting a missing task", async () => {
    findFirstMock.mockResolvedValue(null);

    const response = await router.request("/tasks/12", {
      method: "DELETE",
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Task not found" });
    expect(deleteWhereMock).not.toHaveBeenCalled();
  });
});
