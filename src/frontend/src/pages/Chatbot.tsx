import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, MessageCircle, Plus, Send, User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../backend";
import ProtectedRoute from "../components/ProtectedRoute";
import { useGetChatHistory, useSendMessage } from "../hooks/useQueries";

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  const date = new Date(ms);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

const WELCOME_MESSAGE =
  "Hello! I'm Sarthi AI, your educational and career guidance assistant. I can help you with:\n\n• Career path suggestions\n• Subject recommendations\n• Study tips and strategies\n• Scholarship and internship guidance\n• Exam preparation advice\n\nWhat would you like to know today?";

const SUGGESTED_QUESTIONS = [
  "What career suits me if I love Mathematics?",
  "How do I prepare for JEE/NEET?",
  "Which scholarships are available for engineering students?",
  "What skills should I learn for a tech career?",
];

export default function Chatbot() {
  const { data: chatHistory = [], isLoading } = useGetChatHistory();
  const sendMessage = useSendMessage();
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<
    Array<{ sender: string; message: string; timestamp: bigint }>
  >([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize local messages from chat history once loaded
  useEffect(() => {
    if (!isLoading && !hasInitialized) {
      setHasInitialized(true);
      if (chatHistory.length > 0) {
        setLocalMessages(chatHistory.map((m) => ({ ...m })));
      }
    }
  }, [isLoading, chatHistory, hasInitialized]);

  // Scroll to bottom on new messages — intentionally depend on localMessages length
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll triggered by message count
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || sendMessage.isPending) return;

    const userMsg: ChatMessage = {
      sender: "User",
      message: text,
      timestamp: BigInt(Date.now()) * 1_000_000n,
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const botResponse = await sendMessage.mutateAsync(text);
      setLocalMessages((prev) => [...prev, botResponse]);
    } catch {
      const errorMsg: ChatMessage = {
        sender: "Chatbot",
        message: "Sorry, I encountered an error. Please try again.",
        timestamp: BigInt(Date.now()) * 1_000_000n,
      };
      setLocalMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setLocalMessages([]);
    setHasInitialized(false);
  };

  const showWelcome = localMessages.length === 0 && !isLoading;

  // Group messages by date for display
  const groupedMessages = React.useMemo(() => {
    const groups: Array<{ date: string; messages: typeof localMessages }> = [];
    let currentDate = "";
    for (const msg of localMessages) {
      const date = formatDate(msg.timestamp);
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }
    return groups;
  }, [localMessages]);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                AI Chatbot
              </h1>
              <p className="text-muted-foreground text-xs">
                Powered by Sarthi AI
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="gap-1.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat Container */}
        <div
          className="bg-card rounded-2xl border border-border shadow-card flex flex-col"
          style={{ height: "calc(100vh - 280px)", minHeight: "480px" }}
        >
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="space-y-4 p-2">
                {(
                  [
                    { k: "c1", rev: false, w: "w-3/4" },
                    { k: "c2", rev: true, w: "w-2/3" },
                    { k: "c3", rev: false, w: "w-3/4" },
                  ] as const
                ).map(({ k, rev, w }) => (
                  <div
                    key={k}
                    className={`flex gap-3 ${rev ? "flex-row-reverse" : ""}`}
                  >
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <Skeleton className={`h-16 rounded-2xl ${w}`} />
                  </div>
                ))}
              </div>
            ) : showWelcome ? (
              <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
                <div className="w-20 h-20 rounded-2xl gradient-teal flex items-center justify-center mb-4 shadow-teal">
                  <img
                    src="/assets/generated/chatbot-avatar.dim_128x128.png"
                    alt="Sarthi AI"
                    className="w-16 h-16 rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <Bot className="h-10 w-10 text-white hidden" />
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground mb-2">
                  Sarthi AI Assistant
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6 whitespace-pre-line">
                  {WELCOME_MESSAGE}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-left px-3 py-2.5 rounded-xl border border-border bg-background hover:border-teal/40 hover:bg-teal/5 text-sm text-muted-foreground hover:text-foreground transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1 pb-2">
                {groupedMessages.map((group) => (
                  <div key={group.date}>
                    {/* Date separator */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground font-medium px-2">
                        {group.date}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    {group.messages.map((msg, mi) => {
                      const isUser = msg.sender === "User";
                      return (
                        <div
                          key={`${group.date}-${mi}`}
                          className={`flex gap-2.5 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${isUser ? "gradient-amber" : "gradient-teal"}`}
                          >
                            {isUser ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          {/* Bubble */}
                          <div
                            className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                isUser
                                  ? "gradient-teal text-white rounded-tr-sm"
                                  : "bg-muted text-foreground rounded-tl-sm"
                              }`}
                            >
                              {msg.message}
                            </div>
                            <span className="text-xs text-muted-foreground px-1">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Typing indicator */}
                {sendMessage.isPending && (
                  <div className="flex gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center gradient-teal text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about careers, education, scholarships..."
                className="flex-1 min-h-[44px] max-h-32 resize-none focus-visible:ring-teal text-sm"
                rows={1}
                disabled={sendMessage.isPending}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || sendMessage.isPending}
                className="gradient-teal text-white border-0 hover:opacity-90 h-11 w-11 p-0 flex-shrink-0"
                size="icon"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
