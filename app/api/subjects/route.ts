import { getSubjects } from "@/lib/sqlite";

export async function GET() {
  const subjects = await getSubjects();
  return Response.json(subjects);
}
