import { getResources } from "@/lib/sqlite";

export async function GET() {
  const resources = await getResources();
  return Response.json(resources);
}
