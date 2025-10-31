import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, Zap, Brain } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI construction assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulated AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: "Thanks for your question! I'm here to help with construction projects, contractor recommendations, cost estimates, and more. What specific assistance do you need?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse border-2 border-yellow-600"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-30 animate-ping"></div>
            <div className="relative flex items-center justify-center">
              <Brain className="w-7 h-7 text-black" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-orange-500 animate-bounce" />
              <Zap className="absolute -bottom-1 -left-1 w-3 h-3 text-amber-600 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 bg-black text-yellow-400 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce border-2 border-yellow-500">
              AI
            </div>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-yellow-400 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chat with AI Assistant
            </div>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed bottom-5 right-5 
            w-[90%] max-w-md h-[75vh] sm:h-[500px] 
            bg-white rounded-2xl shadow-2xl border border-gray-200 
            z-50 flex flex-col overflow-hidden
            sm:w-96
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-black relative overflow-hidden border-b-2 border-yellow-600">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-black">
                    <Bot className="w-6 h-6 text-black" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-yellow-400 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black">AI Assistant</h3>
                  <p className="text-sm text-gray-800">Construction Expert</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div className="max-w-[85%] sm:max-w-[80%]">
                  {message.isBot && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border border-yellow-600">
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <div
                    className={`p-2 sm:p-3 rounded-2xl ${
                      message.isBot
                        ? "bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-gray-800"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg border border-yellow-600"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border border-yellow-600">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-xs text-gray-500">AI is typing...</span>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about construction, contractors, estimates..."
                  className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-xs sm:text-sm"
                  rows={1}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2 sm:p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 text-black rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl border border-yellow-600"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <button className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs rounded-full border border-yellow-300">
                Find Contractors
              </button>
              <button className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs rounded-full border border-amber-300">
                Cost Estimate
              </button>
              <button className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs rounded-full border border-orange-300">
                Project Help
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
