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
  "How can I contact Victor?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm Victor's AI assistant. Ask me anything about his experience, technical skills, projects, or how to get in touch with him! 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of the chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input field on desktop when opening
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
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-border/20"
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
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
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
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl border border-border bg-background/85 backdrop-blur-md shadow-2xl flex flex-col z-50 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-muted/30 to-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/5 p-2 rounded-lg border border-border/40">
                  <Sparkles className="size-4.5 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                    Victor&apos;s Assistant
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                    <span className="text-[10px] text-muted-foreground font-medium">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    onClick={handleClear}
                    title="Clear Chat"
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minimize2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Chat Body / Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`size-7.5 rounded-full flex items-center justify-center shrink-0 border ${
                      msg.role === "user"
                        ? "bg-secondary text-secondary-foreground border-border"
                        : "bg-primary text-primary-foreground border-transparent"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted/65 text-foreground border border-border/30 rounded-tl-none"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 max-w-[80%] mr-auto">
                  <div className="size-7.5 rounded-full flex items-center justify-center shrink-0 border bg-primary text-primary-foreground border-transparent">
                    <Bot className="size-4" />
                  </div>
                  <div className="p-3 bg-muted/65 rounded-2xl rounded-tl-none border border-border/30 flex items-center gap-1 h-9">
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-3 bg-destructive/15 border border-destructive/20 text-destructive rounded-xl text-xs flex flex-col gap-1.5">
                  <p className="font-medium">Failed to send message</p>
                  <button
                    onClick={() => handleSend(messages[messages.length - 1].content)}
                    className="text-[10px] underline hover:no-underline font-semibold text-left cursor-pointer"
                  >
                    Retry last message
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-2 pt-1 flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Suggested Questions</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-xs bg-muted hover:bg-muted-foreground/15 text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border/50 text-left transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-border bg-background/50 flex gap-2 items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 min-w-0 bg-muted/50 border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-primary/40 focus:border-primary/50 transition-all text-foreground"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center justify-center p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50 transition-opacity cursor-pointer shadow-sm shrink-0"
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
