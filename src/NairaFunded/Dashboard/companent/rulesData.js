export const chatbotRules = [
  {
    keywords: ["drawdown", "dd", "20%"],
    answer:
      "FundedNaira uses a 20% Overall Drawdown. On a ₦200,000 account, your account breaches if equity or balance touches ₦160,000."
  },

  {
    keywords: ["profit target", "10%"],
    answer:
      "You need to achieve 10% profit while staying within the drawdown limit."
  },

  {
    keywords: ["daily drawdown"],
    answer:
      "FundedNaira has NO daily drawdown rule."
  },

  {
    keywords: ["activity rule", "5 days"],
    answer:
      "You must place at least one trade every 5 days to avoid inactivity."
  },

  {
    keywords: ["scalping"],
    answer:
      "Trades opened and closed within 1–2 minutes are not allowed on more than 5 positions."
  },

  {
    keywords: ["consistency"],
    answer:
      "Instant accounts have a 20% consistency rule. One trading day cannot exceed 20% of total accumulated profits."
  },

  {
    keywords: ["payout"],
    answer:
      "Minimum payout is 10% profit. Profit split is 80% trader and 20% FundedNaira."
  },

  {
    keywords: ["processing"],
    answer:
      "Payouts are normally processed within 12 hours."
  },

  {
    keywords: ["kyc", "verification"],
    answer:
      "You only need your bank account number for verification."
  }
];