import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";


const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = "https://api.fundednaira.net/api/user";


  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [code, setCode] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);


  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");


    if (
      !email.trim() ||
      !code.trim() ||
      !newPassword.trim()
    ) {
      setError("All fields are required.");
      return;
    }


    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        `${API_BASE}/reset_password.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            code,
            new_password: newPassword,
          }),
        }
      );


      const data = await response.json();


      if (!data.success) {
        setError(
          data.message || "Password reset failed."
        );

        return;
      }


      setMessage(data.message);


      setTimeout(() => {
        navigate("/login");
      }, 1200);


    } catch (err) {

      console.log(err);

      setError(
        "Server error. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };



  return (
    <Layout>

      <section className="relative min-h-screen overflow-hidden bg-[#050816] flex items-center justify-center px-6 py-24">


        {/* Background Glow */}

        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,.08),transparent_60%)]" />



        {/* Card */}

        <div className="relative w-full max-w-lg">


          <div className="absolute inset-0 rounded-[36px] bg-gradient-to-r from-sky-500 to-cyan-500 opacity-20 blur-3xl" />


          <div className="relative rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-2xl">



            {/* Icon */}

            <div className="flex justify-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-xl">

                <RotateCcw
                  size={38}
                  className="text-white"
                />

              </div>

            </div>



            {/* Heading */}

            <div className="mt-8 text-center">

              <h1 className="text-4xl font-black text-white">
                Reset Password
              </h1>


              <p className="mt-3 text-slate-400 leading-7">
                Enter the verification code sent to your
                email and create a new secure password.
              </p>

            </div>



            {/* Success Alert */}

            {message && (

              <div className="mt-8 flex gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">

                <CheckCircle2
                  className="text-green-400 shrink-0"
                />


                <p className="text-sm text-green-300">
                  {message}
                </p>

              </div>

            )}



            {/* Error Alert */}

            {error && (

              <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">

                <p className="text-sm text-red-300 break-words">
                  {error}
                </p>

              </div>

            )}



            {/* Form Start */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >



              {/* Email Input */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Email Address
                </label>


                <div className="relative">

                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />


                  <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1220] py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                  />

                </div>

              </div>
                            {/* Reset Code Input */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Verification Code
                </label>


                <div className="relative">

                  <KeyRound
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />


                  <input
                    type="text"
                    value={code}
                    onChange={(e)=>setCode(e.target.value)}
                    placeholder="Enter 6 digit code"
                    maxLength={6}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1220] py-4 pl-12 pr-4 text-center tracking-[0.35em] text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                  />

                </div>

              </div>




              {/* New Password */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  New Password
                </label>


                <div className="relative">


                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />



                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(e)=>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Create new password"
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1220] py-4 pl-12 pr-14 text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                  />



                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >

                    {
                      showPassword ? (
                        <EyeOff size={20}/>
                      ) : (
                        <Eye size={20}/>
                      )
                    }

                  </button>


                </div>


                <p className="mt-2 text-xs text-slate-500">
                  Password must contain at least 6 characters.
                </p>


              </div>





              {/* Security Box */}

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">


                <div className="flex items-center gap-2">


                  <ShieldCheck
                    size={18}
                    className="text-sky-400"
                  />


                  <span className="text-sm text-slate-300">
                    Secure password reset
                  </span>


                </div>



                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  Protected
                </span>


              </div>





              {/* Submit Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/30 transition hover:scale-[1.02] disabled:opacity-60"
              >

                {
                  loading ? (

                    <div className="flex items-center justify-center gap-3">

                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>


                      Resetting...


                    </div>


                  ) : (

                    "Reset Password"

                  )
                }


              </button>
                            {/* Divider */}

              <div className="relative my-8">

                <div className="border-t border-white/10"></div>


                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#050816] px-4 text-sm text-slate-500">
                  OR
                </span>


              </div>




              {/* Login Link */}

              <p className="text-center text-slate-400">


                Remember your password?


                <Link
                  to="/login"
                  className="ml-2 font-semibold text-sky-400 transition hover:text-sky-300"
                >
                  Login
                </Link>


              </p>





              {/* Footer Security */}

              <div className="mt-8 border-t border-white/10 pt-6 text-center">


                <p className="text-sm text-slate-500">
                  Your account security is our priority.
                  Reset links and passwords are protected.
                </p>


              </div>


            </form>


          </div>


        </div>


      </section>

    </Layout>
  );

};


export default ResetPassword;