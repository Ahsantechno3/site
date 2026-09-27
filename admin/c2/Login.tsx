import React, { useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { describeAuthError, useAdminAuth } from "@/services/authContext";

interface AdminLoginPopupProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess?: () => void;
  /** Message from the auth provider, e.g. after the session expired. */
  notice?: string | null;
  onDismissNotice?: () => void;
}

export const AdminLoginPopup: React.FC<AdminLoginPopupProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  notice,
  onDismissNotice,
}) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email.trim(), password);
      onLoginSuccess?.();
      onClose?.();
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4">
      <div
        className="w-full max-w-sm p-6 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--text)",
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <div className="mb-5 text-center">
          <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
            Admin Sign In
          </h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Enter your credentials to manage the store
          </p>
        </div>

        {notice && (
          <div className="mb-3 p-3 text-xs rounded-lg flex items-start gap-2 text-amber-600 bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="flex-1">{notice}</span>
            {onDismissNotice && (
              <button
                type="button"
                onClick={onDismissNotice}
                aria-label="Dismiss notice"
                className="shrink-0 hover:opacity-70"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3 py-2 text-xs bg-transparent rounded-xl focus:outline-none transition-colors"
              style={{
                borderColor: "var(--border)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs bg-transparent rounded-xl focus:outline-none transition-colors"
              style={{
                borderColor: "var(--border)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "var(--text)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 font-semibold text-xs rounded-xl transition-all disabled:opacity-50 hover:opacity-90 text-white inline-flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPopup;
