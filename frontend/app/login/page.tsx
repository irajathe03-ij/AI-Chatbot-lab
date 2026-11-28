
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, signupUser } from "@/lib/api";
import {
  Bot,
  Sparkles,
  Eye,
  EyeOff,
  Moon,
  Sun,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = isSignup
        ? await signupUser({ name, email, password })
        : await loginUser({ email, password });

      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("user", JSON.stringify(result.user));

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const theme = isDark
    ? {
        page: "bg-[#171522]",
        card: "bg-[#242132] border-[#39334e]",
        heading: "text-[#f4efff]",
        text: "text-[#b8afca]",
        label: "text-[#d9d0eb]",
        input: "bg-[#302b40] border-[#49415c] text-white placeholder:text-[#9188a3] focus:border-[#b49be8] focus:ring-[#b49be8]/20",
        tabs: "bg-[#302b40]",
        activeTab: "bg-[#4a405f] text-[#e5d8ff]",
        inactiveTab: "text-[#b8afca]",
        button: "bg-[#9b83cf] hover:bg-[#aa91df] text-[#20192f]",
        icon: "bg-[#4a405f] text-[#e8dcff]",
        error: "bg-red-950/40 border-red-800 text-red-300",
        footer: "text-[#9188a3]",
      }
    : {
        page: "bg-gradient-to-br from-[#f5efff] via-[#fff6f8] to-[#eaf4ff]",
        card: "bg-white/90 border-[#eadff5]",
        heading: "text-[#493b64]",
        text: "text-[#877b99]",
        label: "text-[#655678]",
        input: "bg-[#fcfaff] border-[#e8def3] text-[#493b64] placeholder:text-[#b1a5c0] focus:border-[#ad91d8] focus:ring-[#ad91d8]/20",
        tabs: "bg-[#f3eef9]",
        activeTab: "bg-white text-[#8264b2] shadow-sm",
        inactiveTab: "text-[#9689a7]",
        button: "bg-[#a58aca] hover:bg-[#9274bb] text-white",
        icon: "bg-gradient-to-br from-[#c7b2eb] to-[#a58aca] text-white",
        error: "bg-red-50 border-red-200 text-red-600",
        footer: "text-[#aa9db7]",
      };

  return (
    <main className={`relative flex min-h-screen items-center justify-center px-4 py-10 transition-colors duration-500 ${theme.page}`}>
      <button
        type="button"
        onClick={() => setIsDark(!isDark)}
        className={`absolute right-5 top-5 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
          isDark
            ? "border-[#49415c] bg-[#302b40] text-[#e5d8ff]"
            : "border-[#e8def3] bg-white/80 text-[#765d9d]"
        }`}
        aria-label={isDark ? "Switch to pastel mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
        {isDark ? "Pastel Mode" : "Dark Mode"}
      </button>

      <div className={`w-full max-w-md rounded-[2rem] border p-8 shadow-2xl shadow-[#a58aca]/10 backdrop-blur-xl transition-colors duration-500 sm:p-10 ${theme.card}`}>
        <div className="mb-8 flex flex-col items-center text-center">
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-[#a58aca]/20 ${theme.icon}`}>
            <Bot size={34} />
          </div>

          <h1 className={`text-3xl font-bold tracking-tight ${theme.heading}`}>
            AI Assistant
          </h1>

          <p className={`mt-2 text-sm ${theme.text}`}>
            <Sparkles size={14} className="mr-1 inline text-[#b394dc]" />
            Your intelligent conversation partner
          </p>
        </div>

        <div className={`mb-7 grid grid-cols-2 rounded-xl p-1 ${theme.tabs}`}>
          <button
            type="button"
            onClick={() => {
              setIsSignup(false);
              setError("");
            }}
            className={`rounded-lg py-3 text-sm font-semibold transition ${!isSignup ? theme.activeTab : theme.inactiveTab}`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignup(true);
              setError("");
            }}
            className={`rounded-lg py-3 text-sm font-semibold transition ${isSignup ? theme.activeTab : theme.inactiveTab}`}
          >
            Sign Up
          </button>
        </div>

        <h2 className={`mb-2 text-xl font-bold ${theme.heading}`}>
          {isSignup ? "Create your account" : "Welcome back!"}
        </h2>

        <p className={`mb-6 text-sm ${theme.text}`}>
          {isSignup
            ? "Enter your details to get started."
            : "Login to continue your conversations."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label className={`mb-2 block text-sm font-medium ${theme.label}`}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                autoComplete="name"
                className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition focus:ring-4 ${theme.input}`}
              />
            </div>
          )}

          <div>
            <label className={`mb-2 block text-sm font-medium ${theme.label}`}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition focus:ring-4 ${theme.input}`}
            />
          </div>

          <div>
            <label className={`mb-2 block text-sm font-medium ${theme.label}`}>
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={8}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className={`w-full rounded-xl border px-4 py-3.5 pr-12 text-sm outline-none transition focus:ring-4 ${theme.input}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme.text}`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {isSignup && (
              <p className={`mt-2 text-xs ${theme.text}`}>
                Password must contain at least 8 characters.
              </p>
            )}
          </div>

          {error && (
            <div className={`rounded-xl border px-4 py-3 text-sm ${theme.error}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3.5 text-sm font-semibold shadow-lg shadow-[#a58aca]/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${theme.button}`}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <p className={`mt-7 text-center text-xs ${theme.footer}`}>
          Made with care · Your AI conversations start here.
        </p>
      </div>
    </main>
  );
}
