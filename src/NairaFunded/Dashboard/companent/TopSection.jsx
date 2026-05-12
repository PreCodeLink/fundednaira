import { useNavigate } from "react-router-dom";
import { Wallet, Users, DollarSign, User } from "lucide-react";

const TopSection = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">


      {/* 🔥 Shortcut Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate("/dashboard/acc")}
          className="bg-[#111827] p-3 rounded-lg border border-gray-800 hover:border-blue-500 transition text-left"
        >
          <Wallet size={18} className="mb-1 text-blue-400" />
          <p className="text-xs text-gray-400">Buy Accounts</p>
        </button>

        <button
          onClick={() => navigate("/dashboard/payouts")}
          className="bg-[#111827] p-3 rounded-lg border border-gray-800 hover:border-green-500 transition text-left"
        >
          <DollarSign size={18} className="mb-1 text-green-400" />
          <p className="text-xs text-gray-400">Payouts</p>
        </button>

        <button
          onClick={() => navigate("/dashboard/affiliate")}
          className="bg-[#111827] p-3 rounded-lg border border-gray-800 hover:border-purple-500 transition text-left"
        >
          <Users size={18} className="mb-1 text-purple-400" />
          <p className="text-xs text-gray-400">Affiliate</p>
        </button>

        <button
          onClick={() => navigate("/dashboard/profile")}
          className="bg-[#111827] p-3 rounded-lg border border-gray-800 hover:border-yellow-500 transition text-left"
        >
          <User size={18} className="mb-1 text-yellow-400" />
          <p className="text-xs text-gray-400">Profile</p>
        </button>
      </div>
    </div>
  );
};
export default TopSection;