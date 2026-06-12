"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, Send, Sparkles, UserRound, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "ปวดคอ บ่า ไหล่จากนั่งทำงาน ควรทำอย่างไร",
  "มีงบ 2,000 บาท อยากจัดสปา 1 วันในขอนแก่น",
  "สมุนไพรอีสานแบบไหนเหมาะกับกล้ามเนื้อตึง",
  "มีโรคประจำตัว ควรหลีกเลี่ยงทรีตเมนต์อะไร",
];

const headingLines = new Set([
  "ประเมินเบื้องต้น",
  "ดูแลทันที",
  "นวด/สปาที่เหมาะ",
  "สัญญาณอันตราย",
  "ควรพบแพทย์",
  "คำถามต่อยอด",
  "ตัวเลือกที่แนะนำ",
  "ข้อควรระวัง",
  "ช่วงราคาแนะนำ",
  "คำแนะนำ",
  "ตัวอย่างที่ถามได้",
]);

function KhitBorder() {
  return (
    <div
      className="h-1.5 w-full opacity-90"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, #B58900 0px, #B58900 6px, #2D6A4F 6px, #2D6A4F 12px)",
      }}
    />
  );
}

function cleanLine(line: string) {
  return line.replace(/\*\*/g, "").trim();
}

function isHeading(line: string) {
  const normalized = cleanLine(line).replace(/^\[/, "").replace(/\]$/, "").replace(/:$/, "");
  return headingLines.has(normalized);
}

function MessageContent({ content }: { content: string }) {
  const lines = content
    .split("\n")
    .map(cleanLine)
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const numbered = /^\d+\.\s+/.test(line);
        const bulleted = /^[-*•]\s+/.test(line);
        const body = bulleted ? line.replace(/^[-*•]\s+/, "") : line;

        if (isHeading(line)) {
          return (
            <p key={`${line}-${index}`} className="pt-1 text-[0.8rem] font-semibold text-[#17412f]">
              {body.replace(/^\[/, "").replace(/\]$/, "").replace(/:$/, "")}
            </p>
          );
        }

        if (numbered || bulleted) {
          return (
            <p
              key={`${line}-${index}`}
              className={`text-[0.82rem] leading-6 text-[#243a2e] ${bulleted ? "before:mr-2 before:content-['•']" : ""}`}
            >
              {body}
            </p>
          );
        }

        return (
          <p key={`${line}-${index}`} className="text-[0.82rem] leading-6 text-[#243a2e]">
            {body}
          </p>
        );
      })}
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "บอกอาการ เป้าหมายการพักผ่อน เมืองที่สนใจ หรืองบประมาณมาได้เลยครับ\n\nผมจะช่วยแยกเป็น: ประเมินเบื้องต้น, ดูแลทันที, นวด/สปาที่เหมาะ และสัญญาณที่ควรพบแพทย์",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || loading) return;

    if (!textToSend) setInput("");
    setLoading(true);

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const payloadMessages = [...messages, userMessage].map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "ระบบตอบกลับขัดข้องชั่วคราวครับ ลองส่งคำถามอีกครั้ง หรือระบุอาการหลัก ระยะเวลาที่เป็น และเมืองที่สนใจได้เลยครับ",
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "ยังเชื่อมต่อระบบตอบกลับไม่ได้ครับ กรุณาลองใหม่อีกครั้ง หากเป็นอาการปวดรุนแรง ชา อ่อนแรง หรือปวดหลังอุบัติเหตุ ควรพบแพทย์ก่อนรับการนวดครับ",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 font-body sm:right-6 lg:bottom-6">
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex h-[min(640px,calc(100dvh-13rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-[#D8D1C1]/60 bg-[#FAF8F5] shadow-[0_24px_70px_rgba(27,67,50,0.24)] sm:w-[480px] lg:h-[min(700px,calc(100dvh-7rem))] scale-in">
          <KhitBorder />

          <div className="border-b border-[#D8D1C1]/50 bg-[#21563F]/94 px-5 py-4 text-white backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F0C96B]/25 bg-white/10 shadow-inner">
                  <Image src="/can.png" alt="หมอแคน AI" width={34} height={34} className="h-9 w-9 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-heading text-base font-semibold leading-6">หมอแคน AI</h4>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[0.68rem] font-medium text-emerald-50">
                      <Sparkles className="h-3 w-3 text-[#F0C96B]" aria-hidden="true" />
                      วิเคราะห์เป็นขั้นตอน
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-5 text-emerald-50/80">
                    ผู้ช่วยสุขภาพ สปา และทริปเชิงฟื้นฟูภาคอีสาน
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-white/75 transition hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="ปิดกล่องแชท"
                title="ปิด"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-[#FAF8F5] to-[#F2EFE9] px-5 py-5" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex items-start gap-2.5 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                    message.role === "user"
                      ? "border-emerald-100 bg-emerald-50 text-[#21563F]"
                      : "border-[#C9DDCF] bg-[#EAF4EE] text-[#21563F]"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Image src="/can.png" alt="หมอแคน AI" width={24} height={24} className="h-6 w-6 object-contain" />
                  )}
                </div>

                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.02)] ${
                    message.role === "user"
                      ? "rounded-tr-xs bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white"
                      : "rounded-tl-xs border border-[#E8E2D5] bg-white text-[#243a2e]"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <MessageContent content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="ml-10 grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => void handleSend(suggestion)}
                    className="rounded-xl border border-[#DCD5C4] bg-white/80 px-4 py-2.5 text-left text-xs leading-5 text-[#28543E] shadow-sm backdrop-blur-xs transition-all duration-300 hover:border-[#2D6A4F] hover:bg-[#F0F7F3] hover:translate-y-[-1px] hover:shadow-md cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#C9DDCF] bg-[#EAF4EE] overflow-hidden">
                  <Image src="/can.png" alt="หมอแคน AI" width={24} height={24} className="h-6 w-6 object-contain" />
                </div>
                <div className="rounded-2xl rounded-tl-xs border border-[#E8E2D5] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#57705f]">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#2D6A4F]" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#2D6A4F]" style={{ animationDelay: "140ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#2D6A4F]" style={{ animationDelay: "280ms" }} />
                    กำลังวิเคราะห์คำถาม
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend();
            }}
            className="border-t border-[#E8E2D5]/70 bg-white/95 p-4 backdrop-blur-md"
          >
            <div className="flex items-end gap-2.5">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="สอบถามข้อมูล หรืออาการเบื้องต้นที่ต้องการปรึกษา..."
                disabled={loading}
                rows={1}
                maxLength={1200}
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-[#DCD5C4] bg-[#FAF8F5] px-4 py-2.5 text-sm leading-6 text-[#1E3A27] outline-none transition-all placeholder:text-slate-400 focus:border-[#2D6A4F] focus:bg-white focus:ring-3 focus:ring-emerald-100/50 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white shadow-md transition-all duration-300 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
                aria-label="ส่งข้อความ"
                title="ส่งข้อความ"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button Container to hold the circular button and the absolute notification badge */}
      <div className="relative ml-auto h-16 w-16 animate-float">
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-[#F0C96B]/35 bg-gradient-to-tr from-[#245C45]/85 to-[#1B4332]/95 text-white backdrop-blur-md shadow-[0_12px_40px_rgba(27,67,50,0.35)] transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer btn-sheen glow-pulse-gold"
          aria-label={isOpen ? "ปิดแชทบอทหมอแคน" : "เปิดแชทบอทหมอแคน"}
          title={isOpen ? "ปิดแชท" : "ถามหมอแคน AI"}
        >
          {isOpen ? (
            <X className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="h-7.5 w-7.5 text-white transition-transform duration-300 hover:scale-105" />
            </div>
          )}
        </button>

        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F0C96B] opacity-75" />
            <span className="relative inline-flex h-4.5 w-4.5 rounded-full border-2 border-[#FAF8F5] bg-[#F0C96B]" />
          </span>
        )}
      </div>
    </div>
  );
}

