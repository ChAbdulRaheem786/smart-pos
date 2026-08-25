import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function ProtectedAdminRoute() {
  const { isAuthed, checking } = useAdminAuth();

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg text-ink-soft">
        Checking session…
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
