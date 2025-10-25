import { useAuth } from "../hooks/useAuth";

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Einstellungen</h1>
      <div className="card">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="text-gray-900 font-medium">{user?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">E-Mail</p>
            <p className="text-gray-900 font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Konto erstellt</p>
            <p className="text-gray-900 font-medium">{user ? new Date(user.created_at).toLocaleDateString("de-DE") : "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
