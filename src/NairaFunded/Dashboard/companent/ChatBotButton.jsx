import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ChatBotModal from "./ChatBotModal";

export default function ChatBotButton() {
  const [showBot, setShowBot] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowBot(true)}
        className="fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>

      {showBot && (
        <ChatBotModal
          onClose={() => setShowBot(false)}
        />
      )}
    </>
  );
}