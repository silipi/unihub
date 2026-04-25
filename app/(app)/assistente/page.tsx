"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { initialChatMessages, student, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const suggestions = [
  "Qual a nota mínima para aprovação?",
  "Como funciona o TCC no curso?",
  "Quais prazos tenho esta semana?",
  "Me explica o algoritmo de Dijkstra",
  "Como solicitar trancamento de disciplina?",
  "Dicas para melhorar em Cálculo Numérico",
];

const aiResponses: Record<string, string> = {
  "Qual a nota mínima para aprovação?":
    "Na UNIOESTE, a nota mínima para aprovação em disciplinas de graduação é **7,0** (sete). Além disso, você precisa ter frequência mínima de **75%** nas aulas. Se você ficar entre 5,0 e 6,9 com frequência acima de 75%, poderá realizar o Exame Final. Com nota no Exame Final, a média final é calculada como (Nota Semestral + Nota EF) / 2, e você precisa de pelo menos 5,0.",

  "Como funciona o TCC no curso?":
    "O Trabalho de Conclusão de Curso (TCC) em Ciência da Computação na UNIOESTE é dividido em duas etapas:\n\n**TCC I** (7º semestre): Definição do tema, orientador e elaboração da proposta.\n**TCC II** (8º semestre): Desenvolvimento e defesa perante banca avaliadora.\n\nVocê está no 5º semestre, então ainda tem tempo. Comece a pensar em áreas de interesse — áreas como Inteligência Artificial, Engenharia de Software e Redes são bastante exploradas aqui no campus.",

  "Quais prazos tenho esta semana?":
    "Com base no seu calendário acadêmico, você tem os seguintes prazos próximos:\n\n- **Entrega T1 — Engenharia de Software**: 08/05 (em 3 dias) — urgente!\n- **Prova P1 — Redes de Computadores**: 13/05 (em 8 dias)\n- **Prova P1 — Cálculo Numérico**: 15/05 (em 10 dias)\n\nPriorize a entrega do T1 de Engenharia de Software. Posso ajudá-lo a revisar algum conteúdo?",

  "Me explica o algoritmo de Dijkstra":
    "O **algoritmo de Dijkstra** é um algoritmo de busca do caminho mínimo em grafos ponderados com arestas de peso não-negativo.\n\n**Como funciona:**\n1. Inicie com distância 0 para o nó origem e infinito para os demais\n2. Use uma fila de prioridade (min-heap) para sempre processar o nó de menor distância\n3. Para cada vizinho do nó atual, atualize a distância se o caminho via nó atual for menor\n4. Repita até processar todos os nós\n\n**Complexidade:** O((V + E) log V) com heap binário.\n\nÉ relevante para sua disciplina de Análise e Projeto de Algoritmos. Quer que eu gere exercícios práticos?",

  "Como solicitar trancamento de disciplina?":
    "Para trancar uma disciplina na UNIOESTE:\n\n1. Acesse o **Academus** com suas credenciais\n2. Vá em *Matrículas > Trancamento de Disciplina*\n3. Selecione a disciplina e confirme\n\n**Prazos importantes:** O trancamento só é permitido até a data definida no calendário acadêmico (geralmente até 30% das aulas). Após esse prazo, o trancamento não é mais possível.\n\n**Atenção:** O trancamento conta para o histórico, mas não impacta o CR. Se precisar de orientação, o Departamento de Ciência da Computação atende de segunda a sexta, das 8h às 12h e 14h às 18h.",

  "Dicas para melhorar em Cálculo Numérico":
    "Vi que sua nota em Cálculo Numérico está em **4,3** e sua frequência em **72%** (abaixo dos 75% mínimos). Aqui estão algumas dicas:\n\n1. **Frequência primeiro**: compareça às próximas aulas — você está no limite\n2. **Monitoria semanal**: há uma monitoria disponível toda semana (terça, 16h, Sala 105)\n3. **Recursos disponíveis**: baixe a lista de exercícios sobre Métodos Numéricos no repositório\n4. **Foco nos tópicos da P1**: interpolação de Lagrange e Newton, e métodos iterativos (Bissecção, Newton-Raphson)\n\nPosso gerar um resumo dos principais métodos para você revisar antes da prova?",
};

export default function AssistentePage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response =
        aiResponses[text] ??
        `Entendido! Sobre "${text}", posso ajudá-lo com informações sobre regulamentos da UNIOESTE, conteúdo das suas disciplinas do semestre, prazos acadêmicos e muito mais. Pode ser mais específico para eu dar uma resposta mais precisa?`;
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto gap-0 -m-6">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 bg-background">
        {/* Context pill */}
        <div className="flex justify-center">
          <span className="text-xs text-muted bg-surface border border-border rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            Assistente ciente do seu perfil acadêmico — {student.course}, {student.semester}º sem.
          </span>
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions (only when last message is from bot) */}
      {messages[messages.length - 1]?.role === "assistant" && !isTyping && (
        <div className="px-6 pb-3 bg-background">
          <div className="flex gap-2 flex-wrap">
            {suggestions.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs text-primary bg-primary/8 hover:bg-primary/15 px-3 py-1.5 rounded-full transition-colors font-medium border border-primary/20"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-surface px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Pergunte sobre regulamentos, disciplinas, prazos..."
              rows={1}
              className="w-full bg-surface-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors leading-relaxed"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-xs text-muted mt-2 text-center">
          O assistente pode cometer erros. Verifique informações críticas com a secretaria.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message: msg }: { message: ChatMessage }) {
  const isUser = msg.role === "user";

  // Parse simple markdown: **bold**, numbered lists, line breaks
  function renderContent(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      );
      return (
        <span key={i}>
          {rendered}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold",
          isUser ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-surface border border-border text-foreground rounded-tl-sm"
        )}
      >
        {renderContent(msg.content)}
        <p
          className={cn(
            "text-xs mt-1.5",
            isUser ? "text-primary-foreground/60 text-right" : "text-muted"
          )}
        >
          {msg.timestamp}
        </p>
      </div>
    </div>
  );
}
