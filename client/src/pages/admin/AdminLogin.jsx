import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl2 border border-admin-border bg-admin-surface p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-brand text-white font-display font-bold">
            A
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-paper">Admin panel</h1>
          <p className="mt-1 text-sm text-paper/50">Enter your password to manage the store.</p>
        </div>

        <label className="label-text text-paper/60" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          placeholder="••••••••"
          autoFocus
        />

        {error && <p className="mt-3 text-sm font-medium text-red-400">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full bg-brand hover:bg-brand-dark">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
