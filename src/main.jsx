import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./NairaFunded/pages/Home";
import BuyAcc from "./NairaFunded/pages/BuyAcc";
import Affiliate from "./NairaFunded/pages/Affilate";
import Rules from "./NairaFunded/pages/Rules";
import Contact from "./NairaFunded/pages/Contact";
import NotFound from "./NairaFunded/pages/NotFound";
import ScrollToTop from "./NairaFunded/components/Top";
import Dashboard from "./NairaFunded/Dashboard/pages/Dashboard";
import Accounts from "./NairaFunded/Dashboard/pages/Accounts";
import Payout from "./NairaFunded/Dashboard/pages/Payout";
import AffiliateDash from "./NairaFunded/Dashboard/pages/Affilate";
import Profile from "./NairaFunded/Dashboard/pages/Profile";
import AdminDashboard from "./NairaFunded/Admin/pages/Dashboard";
import AdminUsers from "./NairaFunded/Admin/pages/Users";
import AdminAccount from "./NairaFunded/Admin/pages/PurchasedAccount";
import AdminPayments from "./NairaFunded/Admin/pages/Payments";
import AdminFeedBack from "./NairaFunded/Admin/pages/FeedBack";
import AdminSettings from "./NairaFunded/Admin/pages/Settings";
import AdminPayout from "./NairaFunded/Admin/pages/Payout";
import AdminAccountPlans from "./NairaFunded/Admin/pages/Accounts";
import PhaseRequest from "./NairaFunded/Admin/pages/PhaseRequest";
import AdminAuth from "./NairaFunded/Admin/pages/AdminAuth";
import Login from "./NairaFunded/pages/Login";
import Register from "./NairaFunded/pages/Auth";
import VerifyCode from "./NairaFunded/pages/VerifyCode";
import ProtectedRoute from "./NairaFunded/ProtectedRoute";
import ForgotPassword from "./NairaFunded/pages/ForgotPassword";
import ResetPassword from "./NairaFunded/pages/ResetPassword";
import PaymentCallback from "./NairaFunded/Dashboard/pages/PaymentCallback";
import AdminProtectedRoute from "./NairaFunded/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/buy-acc" element={<BuyAcc />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/acc" element={<Accounts />} />
          <Route
            path="/dashboard/payment/callback"
            element={<PaymentCallback />}
          />
          <Route path="/dashboard/payouts" element={<Payout />} />
          <Route path="/dashboard/affiliate" element={<AffiliateDash />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>

        {/* Admin login page - keep public if admin needs to login first */}
        <Route path="/auth/admin" element={<AdminAuth />} />

        {/* Admin protected routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/auth/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/auth/admin/users" element={<AdminUsers />} />
          <Route
            path="/auth/admin/account/purchased"
            element={<AdminAccount />}
          />
          <Route path="/auth/admin/payments" element={<AdminPayments />} />
          <Route path="/auth/admin/feedback" element={<AdminFeedBack />} />
          <Route path="/auth/admin/settings" element={<AdminSettings />} />
          <Route path="/auth/admin/accounts" element={<AdminAccountPlans />} />
          <Route path="/auth/admin/payouts" element={<AdminPayout />} />
          <Route path="/auth/admin/phase" element={<PhaseRequest />} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);