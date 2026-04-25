// Mock data representing a 5th semester Computer Science student at UNIOESTE

export const student = {
  name: "Lucas Mendonça",
  initials: "LM",
  course: "Ciência da Computação",
  semester: 5,
  matricula: "2022100142",
  university: "UNIOESTE",
  campus: "Cascavel",
  cr: 8.3,
  ira: 82.4,
  hoursCompleted: 1680,
  hoursRequired: 3200,
  avatarUrl: null,
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  professor: string;
  grade: number | null;
  gradePartial: number | null;
  frequency: number;
  frequencyRequired: number;
  credits: number;
  status: "ok" | "alert" | "danger";
};

export const subjects: Subject[] = [
  {
    id: "1",
    code: "CC5001",
    name: "Análise e Projeto de Algoritmos",
    professor: "Prof. Dr. Roberto Alves",
    grade: null,
    gradePartial: 7.2,
    frequency: 82,
    frequencyRequired: 75,
    credits: 4,
    status: "ok",
  },
  {
    id: "2",
    code: "CC5002",
    name: "Banco de Dados II",
    professor: "Profa. Dra. Camila Torres",
    grade: null,
    gradePartial: 9.1,
    frequency: 91,
    frequencyRequired: 75,
    credits: 4,
    status: "ok",
  },
  {
    id: "3",
    code: "CC5003",
    name: "Redes de Computadores",
    professor: "Prof. Dr. Fernando Lima",
    grade: null,
    gradePartial: 5.8,
    frequency: 76,
    frequencyRequired: 75,
    credits: 4,
    status: "alert",
  },
  {
    id: "4",
    code: "CC5004",
    name: "Engenharia de Software",
    professor: "Prof. Me. Gustavo Rocha",
    grade: null,
    gradePartial: 8.5,
    frequency: 88,
    frequencyRequired: 75,
    credits: 4,
    status: "ok",
  },
  {
    id: "5",
    code: "CC5005",
    name: "Cálculo Numérico",
    professor: "Profa. Dra. Elaine Souza",
    grade: null,
    gradePartial: 4.3,
    frequency: 72,
    frequencyRequired: 75,
    credits: 4,
    status: "danger",
  },
  {
    id: "6",
    code: "CC5006",
    name: "Sistemas Operacionais",
    professor: "Prof. Dr. André Martins",
    grade: null,
    gradePartial: 7.8,
    frequency: 85,
    frequencyRequired: 75,
    credits: 4,
    status: "ok",
  },
];

export type Event = {
  id: string;
  title: string;
  type: "semana-academica" | "workshop" | "palestra" | "monitoria" | "congresso";
  date: string;
  time: string;
  location: string;
  description: string;
  tags: string[];
  isRecommended: boolean;
  isRegistered: boolean;
  organizer: string;
};

export const events: Event[] = [
  {
    id: "1",
    title: "Semana Acadêmica de Ciência da Computação",
    type: "semana-academica",
    date: "2025-05-12",
    time: "08:00",
    location: "Auditório Central — Campus Cascavel",
    description:
      "A maior semana acadêmica do curso com palestras de empresas como TOTVS, CI&T e Google. Certificado de horas complementares.",
    tags: ["CC", "Horas Complementares", "Networking"],
    isRecommended: true,
    isRegistered: false,
    organizer: "Centro Acadêmico de CC",
  },
  {
    id: "2",
    title: "Workshop: Docker e Kubernetes na Prática",
    type: "workshop",
    date: "2025-05-07",
    time: "14:00",
    location: "Laboratório de Informática III",
    description:
      "Aprenda a containerizar aplicações e orquestrar com Kubernetes. Vagas limitadas a 30 participantes.",
    tags: ["DevOps", "Backend", "Infraestrutura"],
    isRecommended: true,
    isRegistered: true,
    organizer: "PET Computação",
  },
  {
    id: "3",
    title: "Palestra: Carreira em Segurança da Informação",
    type: "palestra",
    date: "2025-05-09",
    time: "19:00",
    location: "Sala 204 — Bloco A",
    description:
      "Rodrigo Albuquerque, engenheiro de segurança na Nubank, fala sobre a carreira em cybersecurity e como entrar na área.",
    tags: ["Segurança", "Carreira"],
    isRecommended: false,
    isRegistered: false,
    organizer: "UNIOESTE Cascavel",
  },
  {
    id: "4",
    title: "Monitoria: Cálculo Numérico",
    type: "monitoria",
    date: "2025-05-06",
    time: "16:00",
    location: "Sala 105 — Bloco B",
    description:
      "Monitoria semanal da disciplina CC5005 com o monitor Pedro Costa. Foco em métodos iterativos e interpolação.",
    tags: ["CC5005", "Monitoria"],
    isRecommended: true,
    isRegistered: false,
    organizer: "Monitoria Acadêmica",
  },
  {
    id: "5",
    title: "WTICIN 2025 — Workshop de TIC no Interior",
    type: "congresso",
    date: "2025-06-02",
    time: "08:00",
    location: "Campus Cascavel",
    description:
      "Submeta seu artigo e participe do workshop de tecnologia. Publicação com ISSN garantida para trabalhos aprovados.",
    tags: ["Pesquisa", "Publicação", "Horas Complementares"],
    isRecommended: true,
    isRegistered: false,
    organizer: "UNIOESTE",
  },
  {
    id: "6",
    title: "Hackathon: Soluções para a Educação",
    type: "workshop",
    date: "2025-05-17",
    time: "09:00",
    location: "Laboratório de Inovação",
    description:
      "48 horas para desenvolver soluções tecnológicas para o setor educacional. Premiação de R$ 5.000 para o primeiro lugar.",
    tags: ["Hackathon", "Inovação", "Premiação"],
    isRecommended: true,
    isRegistered: false,
    organizer: "PET Computação + Empresas Parceiras",
  },
];

export type Resource = {
  id: string;
  title: string;
  type: "prova" | "resumo" | "videoaula" | "material" | "slide";
  subject: string;
  subjectCode: string;
  professor: string;
  year?: number;
  semester?: string;
  size: string;
  downloads: number;
  uploadedBy: string;
  tags: string[];
};

export const resources: Resource[] = [
  {
    id: "1",
    title: "Prova P1 2024/1 — Análise de Algoritmos",
    type: "prova",
    subject: "Análise e Projeto de Algoritmos",
    subjectCode: "CC5001",
    professor: "Prof. Dr. Roberto Alves",
    year: 2024,
    semester: "1",
    size: "420 KB",
    downloads: 312,
    uploadedBy: "Repositório Oficial",
    tags: ["Prova", "Algoritmos", "Complexidade"],
  },
  {
    id: "2",
    title: "Resumo Completo — Normalização de BD",
    type: "resumo",
    subject: "Banco de Dados II",
    subjectCode: "CC5002",
    professor: "Profa. Dra. Camila Torres",
    size: "1.2 MB",
    downloads: 487,
    uploadedBy: "Ana Paula (ex-aluna)",
    tags: ["Normalização", "SQL", "Banco de Dados"],
  },
  {
    id: "3",
    title: "Videoaula: Modelo OSI Camada por Camada",
    type: "videoaula",
    subject: "Redes de Computadores",
    subjectCode: "CC5003",
    professor: "Prof. Dr. Fernando Lima",
    size: "890 MB",
    downloads: 203,
    uploadedBy: "Repositório Oficial",
    tags: ["OSI", "Redes", "Protocolos"],
  },
  {
    id: "4",
    title: "Slides: UML e Diagramas de Classe",
    type: "slide",
    subject: "Engenharia de Software",
    subjectCode: "CC5004",
    professor: "Prof. Me. Gustavo Rocha",
    size: "5.4 MB",
    downloads: 156,
    uploadedBy: "Repositório Oficial",
    tags: ["UML", "Modelagem", "Engenharia de Software"],
  },
  {
    id: "5",
    title: "Lista de Exercícios — Métodos Numéricos",
    type: "material",
    subject: "Cálculo Numérico",
    subjectCode: "CC5005",
    professor: "Profa. Dra. Elaine Souza",
    size: "230 KB",
    downloads: 278,
    uploadedBy: "Repositório Oficial",
    tags: ["Exercícios", "Cálculo", "Métodos Iterativos"],
  },
  {
    id: "6",
    title: "Prova P1 2024/2 — Sistemas Operacionais",
    type: "prova",
    subject: "Sistemas Operacionais",
    subjectCode: "CC5006",
    professor: "Prof. Dr. André Martins",
    year: 2024,
    semester: "2",
    size: "540 KB",
    downloads: 391,
    uploadedBy: "Repositório Oficial",
    tags: ["Prova", "Processos", "Escalonamento"],
  },
  {
    id: "7",
    title: "Resumo: Gerenciamento de Memória",
    type: "resumo",
    subject: "Sistemas Operacionais",
    subjectCode: "CC5006",
    professor: "Prof. Dr. André Martins",
    size: "780 KB",
    downloads: 224,
    uploadedBy: "Carlos Eduardo (ex-aluno)",
    tags: ["Memória", "Paginação", "Segmentação"],
  },
  {
    id: "8",
    title: "Material: Interpolação de Lagrange e Newton",
    type: "material",
    subject: "Cálculo Numérico",
    subjectCode: "CC5005",
    professor: "Profa. Dra. Elaine Souza",
    size: "1.8 MB",
    downloads: 189,
    uploadedBy: "Repositório Oficial",
    tags: ["Interpolação", "Cálculo", "Numérico"],
  },
];

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Olá, Lucas! Sou o assistente acadêmico da UNIOESTE. Posso ajudá-lo com informações sobre regulamentos, prazos, procedimentos, conteúdo das suas disciplinas e muito mais. Como posso ajudar hoje?",
    timestamp: "14:32",
  },
];

export const deadlines = [
  { id: "1", title: "Entrega do Trabalho T1 — Engenharia de Software", date: "2025-05-08", subject: "CC5004", urgent: true },
  { id: "2", title: "Prova P1 — Redes de Computadores", date: "2025-05-13", subject: "CC5003", urgent: false },
  { id: "3", title: "Prova P1 — Cálculo Numérico", date: "2025-05-15", subject: "CC5005", urgent: false },
  { id: "4", title: "Inscrição no WTICIN 2025", date: "2025-05-20", subject: "Acadêmico", urgent: false },
];
