import { getDeadlines } from "@/lib/sqlite";

export async function GET() {
  const deadlines = await getDeadlines();
  return Response.json(deadlines);
}
