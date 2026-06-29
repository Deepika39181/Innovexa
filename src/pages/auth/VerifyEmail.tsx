import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldAlert,
  CheckCircle,
  Send,
  ArrowLeft,
  MailOpen,
} from "lucide-react";

export const VerifyEmail: React.FC = () => {
  const { verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  const stateEmail = location.state?.email || "";
  const initialMessage = location.state?.message || "";

  const [email, setEmail] = useState(stateEmail);
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(
    initialMessage || null
  );

  const handleVerify = async (tokenToUse?: string) => {
    const activeToken = tokenToUse || token;

    if (!activeToken) {
      setErrorMsg("Please enter your verification token.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsVerifying(true);

    const result = await verifyEmail(activeToken);

    setIsVerifying(false);

    if (result.success) {
      setSuccessMsg("Email verified successfully! Redirecting you to login...");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } else {
      setErrorMsg(result.message);
    }
  };

  useEffect(() => {
    if (calledRef.current) return;

    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      calledRef.current = true;
      setToken(urlToken);
      handleVerify(urlToken);
    }
  }, [location.search]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMsg("Please specify an email address to resend the code.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsResending(true);

    const result = await resendVerification(email);

    setIsResending(false);

    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 p-8 shadow-xl space-y-6 text-left relative">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
            <MailOpen className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify Your Email
          </h1>

          <p className="text-xs text-slate-400 font-medium">
            We have sent a verification code / link to your inbox. Please check
            your spam folder if you can't find it.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold flex items-start gap-2">
            <CheckCircle className="w-4.5 h-4.5 shrink-0 text-green-500 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start gap-2">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Verification Token
            </label>

            <input
              id="verify-token-input"
              type="text"
              placeholder="Enter token"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full text-center tracking-wider font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100 font-semibold"
            />
          </div>

          <button
            id="verify-submit-btn"
            onClick={() => handleVerify()}
            disabled={isVerifying}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />

        <form onSubmit={handleResend} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Resend Code to
            </label>

            <input
              id="verify-resend-email"
              type="email"
              required
              placeholder="your-email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <button
            id="verify-resend-btn"
            type="submit"
            disabled={isResending}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isResending ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-slate-500"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Resend Verification Email
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;