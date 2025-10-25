import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const href = isAuthenticated ? "/app/overview" : "/";

  return (
    <div className="text-center py-24">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Seite nicht gefunden</p>
      <Link to={href} className="btn btn-primary">Zur Startseite</Link>
    </div>
  );
};
