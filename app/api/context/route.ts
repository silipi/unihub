import { getDeadlines, getEvents, getResources, getStudent, getSubjects } from "@/lib/sqlite";

export async function GET() {
  const [student, subjects, events, resources, deadlines] = await Promise.all([
    getStudent(),
    getSubjects(),
    getEvents(),
    getResources(),
    getDeadlines(),
  ]);

  return Response.json({ student, subjects, events, resources, deadlines });
}
