import { useNavigate } from "react-router-dom";
import { Wallet, Users, DollarSign, User, Wallet2 } from "lucide-react";

const SHORTCUTS = [
  {
    label: "Buy Accounts",
    icon: Wallet,
    path: "/dashboard/acc",
    color: "text-[#38BDF8]",
    glow: "hover:border-[#38BDF8]/40 hover:shadow-[0_0_24px_rgba(56,189,248,0.15)]",
    dot: "bg-[#38BDF8]/10",
  },
  {
    label: "Payouts",
    icon: DollarSign,
    path: "/dashboard/payouts",
    color: "text-emerald-300",
    glow: "hover:border-emerald-400/40 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)]",
    dot: "bg-emerald-400/10",
  },
  {
    label: "Affiliate",
    icon: Users,
    path: "/dashboard/affiliate",
    color: "text-violet-300",
    glow: "hover:border-violet-400/40 hover:shadow-[0_0_24px_rgba(167,139,250,0.15)]",
    dot: "bg-violet-400/10",
  },
  {
    label: "My Account",
    icon:Wallet2 ,
    path: "/dashboard/my-acc",
    color: "text-amber-300",
    glow: "hover:border-amber-400/40 hover:shadow-[0_0_24px_rgba(251,191,36,0.15)]",
    dot: "bg-amber-400/10",
  },
];

const TopSection = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#5B6B82]">
        Quick Access
      </p>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {SHORTCUTS.map(({ label, icon: Icon, path, color, glow, dot }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center backdrop-blur-xl transition-all duration-200 active:scale-95 sm:flex-row sm:justify-start sm:gap-3 sm:p-3.5 sm:text-left ${glow}`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dot} transition-transform duration-200 group-hover:scale-105`}
            >
              <Icon size={18} className={color} />
            </span>
            <p className="text-[0.7rem] font-medium leading-tight text-[#93A0B4] group-hover:text-[#F3EFE6] sm:text-xs">
              {label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopSection;