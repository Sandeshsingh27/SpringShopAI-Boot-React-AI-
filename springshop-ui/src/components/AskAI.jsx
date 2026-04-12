import { useEffect, useState, useCallback, useRef } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';

function AskAi() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const conversationIdRef = useRef(crypto.randomUUID());
  const abortControllerRef = useRef(null);

  // Prefer env var; fallback helps during local dev
  const baseUrl = import.meta.env.VITE_BASE_URL ?? 'http://localhost:8080';

  // Seed a welcome message once
  useEffect(() => {
    setMessages([
      {
        message: "Hello! I'm SpringShop AI assistant. How can I help you today?",
        sender: "AI",
        direction: "incoming"
      }
    ]);
  }, []);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleSend = useCallback(async (messageText) => {
    const userMessage = {
      message: messageText,
      sender: "user",
      direction: "outgoing"
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      await streamMessageFromBot(messageText);
    } catch (err) {
      if (err.name === 'AbortError') {
        // User stopped the stream — append a note to the partial response
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.sender === "AI") {
            updated[updated.length - 1] = {
              ...last,
              message: last.message + "\n\n⏹ [Response stopped]"
            };
          }
          return updated;
        });
      } else {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [baseUrl]);

  async function streamMessageFromBot(chatMessage) {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const url = `${baseUrl}/api/chat/stream`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: chatMessage,
        conversationId: conversationIdRef.current
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      let errMsg = 'Failed to get response from AI';
      try {
        errMsg = await response.text();
      } catch { /* ignore */ }
      throw new Error(errMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Add an empty AI message that we'll stream into
    setMessages(prev => [
      ...prev,
      {
        message: "",
        sender: "AI",
        direction: "incoming"
      }
    ]);

    let accumulated = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE data lines: "data:token\n\n"
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const token = line.slice(5);
            accumulated += token;
          } else if (line.trim() !== "") {
            // Some SSE implementations send raw tokens without "data:" prefix
            accumulated += line;
          }
        }

        // Update the last message with accumulated text
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            message: accumulated
          };
          return updated;
        });
      }
    } finally {
      reader.releaseLock();
    }
  }

  return (
    <div className="container-fluid mt-5 pt-5 animate-fade-in-up">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card panel-card" style={{ height: "80vh" }}>
            <div className="card-header d-flex align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-robot me-2"></i>
                AI Assistant
              </h5>
              <span className="badge bg-light text-dark ms-auto" style={{ fontSize: "0.7rem" }}>
                <i className="bi bi-cpu me-1"></i>Powered by Mistral
              </span>
            </div>

            <div className="card-body p-0" style={{ height: "calc(100% - 56px)" }}>
              <MainContainer style={{ height: "100%" }}>
                <ChatContainer style={{ height: "100%" }}>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={isTyping ? <TypingIndicator content="AI is typing" /> : null}
                  >
                    {messages.map((m, i) => (
                      <Message
                        key={i}
                        model={m}
                        className={m.error ? "error-message" : ""}
                        style={{ whiteSpace: "pre-wrap" }}
                      />
                    ))}
                  </MessageList>

                  {isTyping ? (
                    <div
                      as="MessageInput"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "12px",
                        borderTop: "1px solid #e2e8f0",
                        background: "#f8fafc"
                      }}
                    >
                      <button
                        onClick={handleStop}
                        className="btn"
                        style={{
                          background: "linear-gradient(135deg, #ef4444, #dc2626)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "24px",
                          padding: "8px 28px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      >
                        <i className="bi bi-stop-circle-fill"></i>
                        Stop Generating
                      </button>
                    </div>
                  ) : (
                    <MessageInput
                      placeholder="Type your message here..."
                      onSend={handleSend}
                      attachButton={false}
                    />
                  )}
                </ChatContainer>
              </MainContainer>
            </div>

            {error && (
              <div className="alert alert-danger m-3 mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AskAi;
