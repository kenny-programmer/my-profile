"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Trash2,
  Loader2,
  Minimize2,
} from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What are Victor's main skills?",
  "Tell me about the Study-Bible App.",
  "What is Victor's background?",
  "How did he build the Slime Slayer game?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm Victor's AI assistant. Ask me anything about his experience, technical skills, projects, or how to play the Slime Slayer game! 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to get a response from the AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chat reset! Ask me anything about Victor's resume, projects, or background.",
      },
    ]);
    setError(null);
  };

  return (
    <>
      {/* Floating Action Button (Professional Black and White) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 md:bottom-6 md:right-6 z-50 flex items-center justify-center size-14 rounded-full bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 shadow-lg border border-zinc-800 dark:border-zinc-200 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="size-6" />
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-zinc-500 border border-zinc-700"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-40 right-6 md:bottom-24 md:right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-12rem)] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <Sparkles className="size-4.5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                    Victor&apos;s Assistant
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 dark:bg-zinc-400 inline-block"></span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Representative bot</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    onClick={handleClear}
                    title="Clear Chat"
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  <Minimize2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`size-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
                      msg.role === "user"
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
                        : "bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 border-transparent"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 rounded-tr-none shadow-xs"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-800 rounded-tl-none shadow-xs"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 font-medium">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="size-8 rounded-full flex items-center justify-center shrink-0 border bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 border-transparent shadow-xs">
                    <Bot className="size-4" />
                  </div>
                  <div className="p-3.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-800 flex items-center gap-1 h-9.5">
                    <span className="h-1.5 w-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs flex flex-col gap-1.5">
                  <p className="font-semibold">Failed to send message</p>
                  <button
                    onClick={() => handleSend(messages[messages.length - 1].content)}
                    className="text-[10px] underline hover:no-underline font-bold text-left cursor-pointer"
                  >
                    Retry last message
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions badges */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-3 pt-1.5 flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Suggested Questions</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-xs bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-left transition-all duration-200 cursor-pointer font-semibold shadow-xs hover:scale-102"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-background/50 flex gap-2 items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 min-w-0 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-zinc-500/30 focus:border-zinc-500/40 transition-all text-foreground"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50 transition-opacity cursor-pointer shadow shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
