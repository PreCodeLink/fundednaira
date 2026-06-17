import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
} from "lucide-react";
const knowledgeBase = [
  {
    keywords: [
  "drawdown",
  "dd",
  "loss",
  "breach",
  "equity",
  "max loss",
  "how much can i lose",
  "account breach",
  "draw down",
],
    title: "Drawdown Rule",
    answer: `Maximum Drawdown is 20% of your account size.

Example:
₦200,000 Account

Maximum Loss = ₦40,000
Breach Level = ₦160,000

If your equity touches ₦160,000 even for a moment, the account is breached.

Important:
• Floating losses count
• Closed losses count
• Profit later does NOT remove a breach
• Always use Stop Loss`,
  },

  {
    keywords: [
      "profit",
      "target",
      "phase",
      "pass",
      "10%",
    ],
    title: "Profit Target",
    answer: `Your profit target is 10%.

Example:
₦200,000 Account

Target Profit:
₦20,000

Reach 10% profit while respecting drawdown rules to progress to the next phase.`,
  },

  {
   keywords: [
  "payout",
  "withdraw",
  "withdrawal",
  "payment",
  "profit split",
  "when do i get paid",
  "cashout",
],
    title: "Payout Rules",
    answer: `Minimum payout request is 10% profit.

Profit Split:
80% Trader
20% FundedNaira

Processing Time:
Within 12 Hours

Profits above payout cap may be adjusted during processing.`,
  },

  {
    keywords: [
      "scalping",
      "1 minute",
      "2 minute",
      "fast trade",
    ],
    title: "Scalping Rule",
    answer: `Trades opened and closed within 1-2 minutes are not allowed on more than 5 positions.

To stay safe:
Hold trades for more than 2 minutes.`,
  },

  {
    keywords: [
      "activity",
      "inactive",
      "5 days",
      "account inactive",
    ],
    title: "Activity Rule",
    answer: `You must place at least one trade every 5 days.

This prevents broker inactivity restrictions and keeps your account active.`,
  },

  {
    keywords: [
      "consistency",
      "20%",
      "instant",
      "biggest trade",
    ],
    title: "Consistency Rule",
    answer: `For Instant Accounts Only.

Your biggest trading day must not contribute more than 20% of your total accumulated profit.

This encourages consistent performance rather than one lucky trading day.`,
  },

  {
    keywords: [
      "kyc",
      "verification",
      "verify",
      "bank account",
    ],
    title: "KYC Verification",
    answer: `KYC is simple.

You only need your bank account information for verification before receiving payouts.`,
  },
];

const quickQuestions = [
  "What is Drawdown?",
  "Profit Target",
  "Payout Rules",
  "Scalping Rule",
  "Activity Rule",
  "Consistency Rule",
];
export default function ChatBotModal({
  onClose,
}) {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `👋 Welcome to FundedNaira Assistant.

Ask me anything about:

• Drawdown
• Profit Target
• Payouts
• Scalping
• Consistency Rule
• KYC
• Activity Rule`,
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

 const getAnswer = (question) => {
  const q = question.toLowerCase();

  // Drawdown calculator
  const amount = q.match(/\d+/);

  if (
    amount &&
    (
      q.includes("drawdown") ||
      q.includes("loss") ||
      q.includes("breach")
    )
  ) {
    const balance = Number(amount[0]);

    const loss = balance * 0.2;

    const breach = balance - loss;

    return `
Account Size: ₦${balance.toLocaleString()}

Maximum Drawdown:
₦${loss.toLocaleString()}

Breach Level:
₦${breach.toLocaleString()}
`;
  }

  let bestMatch = null;
  let highestScore = 0;

  knowledgeBase.forEach((item) => {
    let score = 0;

    item.keywords.forEach((word) => {
      if (q.includes(word)) {
        score++;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  });

  if (bestMatch) {
    return bestMatch.answer;
  }

  return `
I couldn't find information about that.

Try asking:

• Drawdown
• Profit Target
• Payout
• Scalping
• KYC
• Activity Rule
`;
};

 const sendMessage = () => {
  if (!input.trim()) return;

  const userInput = input;

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userInput,
    },
  ]);

  setInput("");

  setTyping(true);

  setTotalQuestions((prev) => prev + 1);

  const answer = getAnswer(userInput);

  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: answer,
      },
    ]);

    setTyping(false);
  }, 1000);
};

  const handleQuickQuestion = (question) => {
    const answer = getAnswer(question);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: question,
      },
      {
        sender: "bot",
        text: answer,
      },
    ]);
  };
  const [typing, setTyping] = useState(false);
const [totalQuestions, setTotalQuestions] =
  useState(0);
  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-3">

      <div className="
      w-[100vw]
max-w-[600px]
h-[90vh]
max-h-[600px]
      bg-[#0B1120]
      border border-white/10
      rounded-3xl
      shadow-2xl
      flex flex-col
      overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-5 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Bot />
            </div>

            <div>
              <h2 className="font-bold text-white">
                FundedNaira Assistant
              </h2>

              <p className="text-xs text-white/80">
                Rules & Support Bot
              </p>
               <p className="text-xs text-white/80">
    Questions Asked: {totalQuestions}
  </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>

        {/* Suggestions */}
        <div className="p-4 border-b border-white/10 overflow-x-auto">
          <div className="flex gap-2 flex-wrap">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() =>
                  handleQuickQuestion(question)
                }
                className="
                px-3 py-2
                rounded-xl
                bg-sky-500/10
                border border-sky-500/20
                text-sky-400
                text-xs
                hover:bg-sky-500/20
                transition"
              >
                <Sparkles
                  size={12}
                  className="inline mr-1"
                />
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`
                max-w-[85%]
                p-4
                rounded-2xl
                whitespace-pre-line
                text-sm
                ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white"
                }
              `}
              >
                <div className="flex items-center gap-2 mb-2">
                  {msg.sender === "user" ? (
                    <User size={14} />
                  ) : (
                    <Bot size={14} />
                  )}

                  <span className="text-xs opacity-70">
                    {msg.sender === "user"
                      ? "You"
                      : "Assistant"}
                  </span>
                </div>

                {msg.text}
                {msg.sender === "bot" && (
  <button
    onClick={() =>
      navigator.clipboard.writeText(msg.text)
    }
    className="mt-2 text-sky-400 text-xs"
  >
    <Copy size={14} />
  </button>
)}
              </div>
            </div>
          ))}
            {typing && (
  <div className="flex justify-start">
    <div className="bg-white/10 text-white p-4 rounded-2xl">
      Assistant is typing...
    </div>
  </div>
)}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">

          <div className="flex gap-2">

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
              placeholder="Ask anything about FundedNaira..."
              className="
              flex-1
              bg-[#111827]
              text-white
              px-4
              py-3
              rounded-2xl
              outline-none
              border border-white/10"
            />

            <button
              onClick={sendMessage}
              className="
              px-5
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              transition"
            >
              <Send size={18} />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}