import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  MessageSquare,
  Menu,
  ShoppingCart,
  ArrowUpRight,
  ArrowBigRight,
  Gift,
  MoveUpRight,
  ArrowBigUpIcon,
  X,
  LogOut,
  UserCog,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-[#05070D] text-white overflow-hidden">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-[270px]
          bg-[#0A0E17]
          border-r border-white/[0.07]
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* Logo */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-white/[0.07]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                <span className="text-sky-400">Funded</span>Naira
              </h1>

              <p className="text-[9px] text-gray-500 tracking-widest">
                ADMIN PORTAL
              </p>
            </div>

          </div>

          <button
            onClick={closeSidebar}
            className="md:hidden text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">

          <NavSection title="Overview">

            <NavItem
              to="/auth/admin/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={closeSidebar}
            />

          </NavSection>


          <NavSection title="Users & Accounts">

            <NavItem
              to="/auth/admin/users"
              icon={Users}
              label="Manage Users"
              onClick={closeSidebar}
            />

            <NavItem
              to="/auth/admin/account/purchased"
              icon={Wallet}
              label="Purchased Accounts"
              onClick={closeSidebar}
            />

            <NavItem
              to="/auth/admin/accounts"
              icon={ArrowUpRight}
              label="Account Plans"
              onClick={closeSidebar}
            />

            <NavItem
              to="/auth/admin/upload-acc"
              icon={ArrowBigUpIcon}
              label="Upload Account"
              onClick={closeSidebar}
            />

            <NavItem
              to="/auth/admin/upgrade-account"
              icon={MoveUpRight}
              label="Upgrade Account"
              onClick={closeSidebar}
            />

          </NavSection>


          <NavSection title="Financial">

            <NavItem
              to="/auth/admin/payments"
              icon={CreditCard}
              label="Payments"
              onClick={closeSidebar}
            />

            <NavItem
              to="/auth/admin/payouts"
              icon={ShoppingCart}
              label="Payouts"
              onClick={closeSidebar}
            />
  <NavItem
              to="/auth/admin/payouts-daily"
              icon={ShoppingCart}
              label=" Daily Payouts"
              onClick={closeSidebar}
            />
          </NavSection>
          
          <NavSection title="Trading">

            <NavItem
              to="/auth/admin/phase"
              icon={ArrowBigRight}
              label="Phase Requests"
              onClick={closeSidebar}
            />

          </NavSection>


          <NavSection title="Referrals">

            <NavItem
              to="/auth/admin/referrals"
              icon={Users}
              label="Manage Referrals"
              onClick={closeSidebar}
            />
            <NavItem
              to="/auth/admin/daily-referrals"
              icon={Users}
              label="Daily Referrals"
              onClick={closeSidebar}
            />

            <NavItem
              to="/auth/admin/referral-claims"
              icon={Gift}
              label="Referral Claims"
              onClick={closeSidebar}
            />

          </NavSection>


          <NavSection title="Support">

            <NavItem
              to="/auth/admin/feedback"
              icon={MessageSquare}
              label="Feedback"
              onClick={closeSidebar}
            />

          </NavSection>

        </div>


        {/* Admin Profile */}
        <div className="p-3 border-t border-white/[0.07]">

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07]">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <UserCog
                  size={18}
                  className="text-blue-400"
                />
              </div>

              <div className="flex-1">

                <p className="text-sm font-medium">
                  Administrator
                </p>

                <p className="text-[11px] text-gray-500">
                  Full Access
                </p>

              </div>

              <span className="w-2 h-2 rounded-full bg-emerald-400" />

            </div>


            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut size={15} />
              Sign Out
            </button>

          </div>

        </div>

      </aside>


      {/* MAIN AREA */}
      <div className="h-screen md:ml-[270px] flex flex-col">

        {/* TOPBAR */}
        <header className="h-[72px] shrink-0 bg-[#0A0E17] border-b border-white/[0.07] flex items-center justify-between px-4 sm:px-6">

          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>


          {/* Desktop title */}
          <div className="hidden md:block">

            <p className="text-[10px] uppercase tracking-widest text-gray-600">
              Administration
            </p>

            <p className="text-sm text-gray-300 mt-1">
              FundedNaira Control Center
            </p>

          </div>


          {/* Mobile logo */}
          <div className="md:hidden">

            <h2 className="text-lg font-bold">
              <span className="text-sky-400">Funded</span>Naira
            </h2>

          </div>


          {/* Right */}
          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">

              <span className="w-2 h-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-emerald-400">
                System Online
              </span>

            </div>


            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">

              <UserCog
                size={15}
                className="text-blue-400"
              />

              <span className="hidden sm:block text-xs text-gray-300">
                Admin
              </span>

              <ChevronRight
                size={14}
                className="text-gray-600"
              />

            </div>

          </div>

        </header>


        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#05070D]">
          {children}
        </main>

      </div>

    </div>
  );
};


/* NAV SECTION */

const NavSection = ({ title, children }) => {
  return (
    <div className="mb-6">

      <p className="px-3 mb-2 text-[10px] uppercase tracking-widest font-semibold text-gray-600">
        {title}
      </p>

      <div className="space-y-1">
        {children}
      </div>

    </div>
  );
};


/* NAV ITEM */

const NavItem = ({
  to,
  icon: Icon,
  label,
  onClick,
}) => {

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `
        relative flex items-center gap-3
        px-3 py-2.5
        rounded-xl
        text-sm
        transition-all duration-200
        ${
          isActive
            ? "bg-blue-500/10 text-white border border-blue-500/10"
            : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
        }
        `
      }
    >

      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full" />
          )}

          <span
            className={`
              w-8 h-8 rounded-lg
              flex items-center justify-center
              ${
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-gray-600"
              }
            `}
          >
            <Icon size={18} strokeWidth={1.8} />
          </span>

          <span className="flex-1">
            {label}
          </span>

          {isActive && (
            <ChevronRight
              size={14}
              className="text-blue-400"
            />
          )}
        </>
      )}

    </NavLink>
  );
};

export default AdminLayout;