import {
  X,
  Landmark,
  CreditCard,
  Wallet,
  User,
  BadgeDollarSign,
  Briefcase,
  TrendingUp,
  ArrowDownCircle,
  Activity,
} from "lucide-react";

const UserToggleModal = ({ user, onClose }) => {
  if (!user) return null;

  const userName =
    user.full_name || user.name || "Unknown User";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* MODAL */}
      <div className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-[32px] border border-white/10 bg-[#0B1120] shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        
        {/* HEADER */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 relative">
          
          <div className="absolute inset-0 bg-black/10" />

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md transition flex items-center justify-center text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="relative px-6 pb-6">
          
          {/* PROFILE */}
          <div className="-mt-16 flex flex-col md:flex-row md:items-end gap-5">
            
            {/* AVATAR */}
            <div className="w-32 h-32 rounded-3xl bg-[#111827] border-4 border-[#0B1120] flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              {userName?.charAt(0)}
            </div>

            {/* USER INFO */}
            <div className="pb-2">
              <h2 className="text-3xl font-bold text-white">
                {userName}
              </h2>

              <p className="text-gray-400 mt-1 break-all">
                {user.email || "No Email"}
              </p>

              <div
                className={`mt-3 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                  user.status === "Active"
                    ? "bg-green-500/20 text-green-400"
                    : user.status === "Suspended"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {user.status || "Pending"}
              </div>
            </div>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">

            {/* USER ID */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <User size={16} />
                User ID
              </div>

              <p className="text-white text-lg font-semibold">
                FN/NG/{user.id}
              </p>
            </div>

            {/* REF BALANCE */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-green-300 text-sm mb-2">
                <Wallet size={16} />
                Referral Balance
              </div>

              <p className="text-green-400 text-2xl font-bold">
                ₦{user.ref_balance || "0"}
              </p>
            </div>

            {/* REFERRALS */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <BadgeDollarSign size={16} />
                Total Referrals
              </div>

              <p className="text-white text-2xl font-bold">
                {user.ref || 0}
              </p>
            </div>

            {/* TOTAL PURCHASED ACCOUNT */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Briefcase size={16} />
                Total Purchased Accounts
              </div>

              <p className="text-white text-2xl font-bold">
                {user.total_purc_acc || 0}
              </p>
            </div>

            {/* ACTIVE ACCOUNT */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Activity size={16} />
                Active Accounts
              </div>

              <p className="text-white text-2xl font-bold">
                {user.active_account || 0}
              </p>
            </div>

            {/* TOTAL PAYOUT */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-blue-300 text-sm mb-2">
                <TrendingUp size={16} />
                Total Payout
              </div>

              <p className="text-blue-400 text-2xl font-bold">
                ₦{user.total_payout || 0}
              </p>
            </div>

            {/* TOTAL REF WITHDRAW */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-yellow-300 text-sm mb-2">
                <ArrowDownCircle size={16} />
                Total Referral Withdraw
              </div>

              <p className="text-yellow-400 text-2xl font-bold">
                ₦{user.total_ref_bal || 0}
              </p>
            </div>

            {/* BANK NAME */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Landmark size={16} />
                Bank Name
              </div>

              <p className="text-white text-lg font-semibold">
                {user.bank_name || "N/A"}
              </p>
            </div>

            {/* ACCOUNT NAME */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <User size={16} />
                Account Name
              </div>

              <p className="text-white text-lg font-semibold">
                {user.account_name || "N/A"}
              </p>
            </div>

            {/* ACCOUNT NUMBER */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 md:col-span-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <CreditCard size={16} />
                Account Number
              </div>

              <p className="text-white text-xl font-semibold tracking-[3px]">
                {user.account_number || "N/A"}
              </p>
            </div>
          {/* TRADING ACCOUNTS */}
<div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 md:col-span-2">
  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
    <Briefcase size={16} />
    Trading Accounts
  </div>

  <div className="flex flex-wrap gap-2">
    {user.user_accounts?.length ? (
      user.user_accounts.map((acc, index) => (
        <span
          key={index}
          className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm"
        >
          {String(acc.id).padStart(3, "0")} ({acc.size})
        </span>
      ))
    ) : (
      <span className="text-gray-500">No Accounts</span>
    )}
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserToggleModal;
