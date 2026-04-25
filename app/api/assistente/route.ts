import { getEvents, getResources, getStudent, getSubjects } from "@/lib/sqlite";

type AssistenteRequestBody = {
  message?: string;
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

async function buildAcademicContext() {
  const [student, subjects, events, resources] = await Promise.all([
    getStudent(),
    getSubjects(),
    getEvents(),
    getResources(),
  ]);

  if (!student) {
    return JSON.stringify({ erro: "Aluno não encontrado no banco." }, null, 2);
  }

  const studentSnapshot = {
    nome: student.name,
    curso: student.course,
    semestre: student.semester,
    universidade: student.university,
    campus: student.campus,
    cr: student.cr,
    ira: student.ira,
    horasConcluidas: student.hoursCompleted,
    horasTotais: student.hoursRequired,
  };

  const gradesSnapshot = subjects.map((subject) => ({
    codigo: subject.code,
    disciplina: subject.name,
    professor: subject.professor,
    notaParcial: subject.gradePartial,
    notaFinal: subject.grade,
    frequencia: subject.frequency,
    frequenciaMinima: subject.frequencyRequired,
    status: subject.status,
    creditos: subject.credits,
  }));

  const eventsSnapshot = events.map((event) => ({
    titulo: event.title,
    tipo: event.type,
    data: event.date,
    horario: event.time,
    local: event.location,
    recomendado: event.isRecommended,
    inscrito: event.isRegistered,
    tags: event.tags,
  }));

  const resourcesSnapshot = resources.map((resource) => ({
    titulo: resource.title,
    tipo: resource.type,
    disciplina: resource.subject,
    codigoDisciplina: resource.subjectCode,
    professor: resource.professor,
    tamanho: resource.size,
    downloads: resource.downloads,
    tags: resource.tags,
  }));

  return JSON.stringify(
    {
      aluno: studentSnapshot,
      notasEDisciplinas: gradesSnapshot,
      eventos: eventsSnapshot,
      recursos: resourcesSnapshot,
    },
    null,
    2,
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "A variável OPENAI_API_KEY não está configurada no servidor." },
      { status: 500 },
    );
  }

  let body: AssistenteRequestBody;
  try {
    body = (await request.json()) as AssistenteRequestBody;
  } catch {
    return Response.json({ error: "JSON inválido na requisição." }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "A mensagem é obrigatória." }, { status: 400 });
  }

  const academicContext = await buildAcademicContext();

  try {
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente acadêmico da UNIOESTE. Responda em português, com objetividade e clareza. Use os dados do aluno e contexto acadêmico abaixo como fonte primária para respostas personalizadas.\n\nCONTEXTO ACADÊMICO GLOBAL:\n" +
              academicContext,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      return Response.json(
        { error: `Falha na API da OpenAI: ${openaiResponse.status} ${errorText}` },
        { status: 502 },
      );
    }

    const data = (await openaiResponse.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    const responseText = data.choices?.[0]?.message?.content?.trim();

    if (!responseText) {
      return Response.json(
        { error: "A OpenAI retornou uma resposta vazia." },
        { status: 502 },
      );
    }

    return Response.json({ response: responseText });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Erro desconhecido";
    return Response.json(
      { error: `Erro ao consultar a OpenAI: ${messageText}` },
      { status: 500 },
    );
  }
}
