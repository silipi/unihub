import { getEvents } from "@/lib/sqlite";

export async function GET() {
  const events = await getEvents();
  return Response.json(events);
}
