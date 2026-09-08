import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reviews } from "../../db/schema.js";

const MAX_NAME_LENGTH = 32;
const MAX_TEXT_LENGTH = 300;

export default async (req: Request) => {
  if (req.method === "GET") {
    const allReviews = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    return Response.json(allReviews);
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!name || !text) {
      return Response.json({ error: "El nombre y la reseña son obligatorios." }, { status: 400 });
    }

    const [created] = await db
      .insert(reviews)
      .values({
        name: name.slice(0, MAX_NAME_LENGTH),
        text: text.slice(0, MAX_TEXT_LENGTH),
      })
      .returning();

    return Response.json(created, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/reviews",
};
