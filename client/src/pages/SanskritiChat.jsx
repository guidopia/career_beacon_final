import React, { useMemo, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendMessage } from "../services/chatbot";
import {
  ArrowUp,
  User,
  GraduationCap,
  ArrowLeft,
  Target,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const SanskritiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Update once per minute (UI shows hours/minutes).
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedMobileDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }, [currentTime]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [currentTime]);

  const formattedDesktopDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }, [currentTime]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Handle initial message from welcome page - only once
    if (location.state?.initialMessage && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSubmit(location.state.initialMessage);
      // Clear the state to prevent re-sending on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    // This page is rendered inside Layout's scroll container (main has overflow-y-auto).
    // Ensure the header isn't hidden due to preserved scroll position.
    const main = document.querySelector("main");
    if (main && typeof main.scrollTo === "function") {
      main.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else if (main) {
      main.scrollTop = 0;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageContent = (content) => {
    const lines = content.split('\n');
    const formattedElements = [];
    let currentParagraph = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        return;
      }

      if (trimmedLine.endsWith(':') && trimmedLine.length < 80) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        formattedElements.push(
          <div key={formattedElements.length} className="font-semibold text-blue-300 mb-2 mt-4">
            {trimmedLine}
          </div>
        );
        return;
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        formattedElements.push(
          <div key={formattedElements.length} className="mb-2 pl-4">
            {trimmedLine}
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('- ')) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        formattedElements.push(
          <div key={formattedElements.length} className="mb-2 pl-4">
            • {trimmedLine.substring(2)}
          </div>
        );
        return;
      }
      currentParagraph.push(trimmedLine);
    });

    if (currentParagraph.length > 0) {
      formattedElements.push(
        <div key={formattedElements.length} className="mb-3 leading-relaxed">
          {currentParagraph.join(' ')}
        </div>
      );
    }
    return formattedElements;
  };

  const handleSubmit = async (messageText = null, e = null) => {
    if (e) e.preventDefault();

    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Convert messages to format expected by the sendMessage function
      const historyForAPI = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendMessage(textToSend, historyForAPI);
      const botMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again or check your connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToWelcome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black pt-24 text-white flex flex-col relative">
      {/* Mobile Fixed Header - Only show on mobile */}
      <header className="md:hidden sticky top-24 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBackToWelcome}
                className="group flex items-center text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Prodigy AI Assistant</h1>
                  <p className="text-xs text-white/50">Online & Ready</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-white/60">
                {formattedMobileDate}
              </div>
              <div className="text-xs text-white/40">
                {formattedTime}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header - Only show on desktop, not fixed */}
      <header className="hidden md:block sticky top-24 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBackToWelcome}
                className="group flex items-center text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <GraduationCap className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Prodigy AI Assistant</h1>
                  <p className="text-sm text-white/50">Your Career Guidance Assistant</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{messages.length}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Messages</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">Live</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Session</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-right">
                <div className="text-sm text-white/60">
                  {formattedDesktopDate}
                </div>
                <div className="text-xs text-white/40">
                  {formattedTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-28">
        <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
          {messages.length === 0 && !isLoading && (
            <div className="py-6 md:py-10">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-black/60 backdrop-blur-sm p-6 md:p-10 overflow-hidden relative">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />
                  </div>

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                        Ask anything. Get a clear next step.
                      </h3>
                      <p className="text-sm md:text-base text-white/65 mt-2 max-w-2xl leading-relaxed">
                        I can help you with career clarity, course choices, skill-building, and (when relevant) study abroad planning—without overwhelming you.
                      </p>
                    </div>

                      <div className="mt-6 flex flex-wrap gap-2.5">
                        <span className="px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/[0.03] text-white/70">
                          Career roadmap
                        </span>
                        <span className="px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/[0.03] text-white/70">
                          Stream & course selection
                        </span>
                        <span className="px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/[0.03] text-white/70">
                          Skill strategy
                        </span>
                        <span className="px-3 py-1.5 text-xs rounded-full border border-blue-400/20 bg-blue-500/[0.06] text-blue-100/80">
                          Study abroad planning
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                        <button
                          onClick={() => handleSubmit("Help me shortlist countries/universities for MS abroad and plan IELTS/TOEFL/GRE timeline.")}
                          className="text-left rounded-2xl border border-blue-400/15 bg-blue-500/[0.05] hover:bg-blue-500/[0.08] transition p-4"
                        >
                          <p className="text-xs font-semibold text-blue-200/80 uppercase tracking-wide">
                            Study Abroad
                          </p>
                          <p className="text-sm font-semibold text-white mt-1">
                            Shortlist + exam timeline
                          </p>
                          <p className="text-xs text-white/55 mt-1 leading-relaxed">
                            Countries, universities, IELTS/TOEFL/GRE plan.
                          </p>
                        </button>

                        <button
                          onClick={() => handleSubmit("What scholarships should I target for studying abroad and what profile improvements should I prioritize?")}
                          className="text-left rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.05] hover:bg-cyan-500/[0.08] transition p-4"
                        >
                          <p className="text-xs font-semibold text-cyan-200/80 uppercase tracking-wide">
                            Funding
                          </p>
                          <p className="text-sm font-semibold text-white mt-1">
                            Scholarships strategy
                          </p>
                          <p className="text-xs text-white/55 mt-1 leading-relaxed">
                            Profile upgrades + scholarship categories.
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSubmit("I'm confused about choosing between engineering and medical. Can you help?")}
                      className="px-4 py-2 text-xs bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-full text-white/80 hover:text-white transition"
                    >
                      Engineering vs Medical
                    </button>
                    <button
                      onClick={() => handleSubmit("What career options do I have after 12th commerce?")}
                      className="px-4 py-2 text-xs bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-full text-white/80 hover:text-white transition"
                    >
                      After 12th Commerce
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 md:mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] md:max-w-3xl rounded-xl md:rounded-2xl p-4 md:p-6 ${message.role === "user"
                  ? "bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white border border-blue-400/25 shadow-[0_12px_30px_rgba(37,99,235,0.18)]"
                  : "bg-white/[0.03] text-white border border-white/10 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {message.role === "user" ? (
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400/80 via-cyan-300/70 to-violet-400/80 p-[1px] shadow-[0_10px_22px_rgba(34,211,238,0.22)]">
                        <div className="w-full h-full rounded-full bg-black/55 backdrop-blur flex items-center justify-center border border-white/10">
                          <span className="text-[10px] md:text-xs font-extrabold tracking-tight text-white/90 select-none">
                            P
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    {message.role === "assistant" ? (
                      <div className="text-white/90 text-sm md:text-base leading-relaxed">
                        {formatMessageContent(message.content)}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-white/95 text-sm md:text-base">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4 md:mb-6">
              <div className="bg-white/[0.03] rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400/80 via-cyan-300/70 to-violet-400/80 p-[1px] shadow-[0_10px_22px_rgba(34,211,238,0.22)]">
                      <div className="w-full h-full rounded-full bg-black/55 backdrop-blur flex items-center justify-center border border-white/10">
                        <span className="text-[10px] md:text-xs font-extrabold tracking-tight text-white/90 select-none">
                          P
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 md:space-x-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400 animate-bounce"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input - Responsive */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 lg:left-72 z-50 bg-black/95 backdrop-blur-sm border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="px-3 md:px-4 lg:px-6 py-2.5 md:py-2 max-w-none md:max-w-4xl lg:max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/90 to-black/90 rounded-xl md:rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center p-2 md:p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit(null, e)}
                className="flex-1 bg-transparent text-white px-3 py-2 md:px-3 md:py-1 focus:outline-none placeholder-white/40 text-base sm:text-lg md:text-base lg:text-lg"
                placeholder="Ask about your education or career..."
                disabled={isLoading}
              />
              <button
                onClick={(e) => handleSubmit(null, e)}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg md:rounded-xl p-2.5 md:p-2 lg:p-2.5 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/30 disabled:hover:scale-100 mr-2 md:mr-1"
              >
                <ArrowUp className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>
          <div className="text-center mt-2 md:mt-1.5 text-sm md:text-sm text-white/40">
            Press Enter to send • Prodigy AI Assistant is here to help with your career decisions
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanskritiChat;