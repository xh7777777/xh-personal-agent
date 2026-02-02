import { z } from "zod"

export const NotFoundSchema = z.object({ error: z.string() })
