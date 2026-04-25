"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { initialChatMessages, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Student } from "@/lib/mock-data";

const suggestions = [
  "Qual a nota mínima para aprovação?",
  "Como funciona o TCC no curso?",
  "Quais prazos tenho esta semana?",
  "Me explica o algoritmo de Dijkstra",
  "Como solicitar trancamento de disciplina?",
  "Dicas para melhorar em Cálculo Numérico",
];

async function getAIResponse(message: string): Promise<string> {
  const response = await fetch("/api/assistente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = (await response.json()) as { response?: string; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Falha ao consultar o assistente.");
  }

  return data.response ?? "Não consegui gerar uma resposta no momento.";
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [student, setStudent] = useState<Student | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(2);

  function nextMessageId() {
    const id = messageIdRef.current;
    messageIdRef.current += 1;
    return id.toString();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    async function loadStudent() {
      try {
        const response = await fetch("/api/student");
        if (!response.ok) return;
        const data = (await response.json()) as Student | null;
        setStudent(data);
      } catch {
        setStudent(null);
      }
    }

    loadStudent();
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: nextMessageId(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getAIResponse(text);
      const botMsg: ChatMessage = {
        id: nextMessageId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao buscar resposta do assistente.";
      const botErrorMsg: ChatMessage = {
        id: nextMessageId(),
        role: "assistant",
        content: `Não consegui responder agora. ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setIsTyping(false);
    }
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
            Assistente ciente do seu perfil acadêmico — {student?.course ?? "Curso"}, {student?.semester ?? "?"}º sem.
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
