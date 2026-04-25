import { getStudent } from "@/lib/sqlite";

export async function GET() {
  const student = await getStudent();
  return Response.json(student);
}
