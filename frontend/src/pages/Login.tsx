import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LayoutDashboard } from "lucide-react";
import { authApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm extends LoginForm {
  full_name: string;
  tenant_name: string;
}

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    setIsLoading(true);

    try {
      const response = isRegister
        ? await authApi.register(data)
        : await authApi.login({ email: data.email, password: data.password });

      setAuth(response.user, response.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <LayoutDashboard className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">DealFlow</h1>
          <p className="text-primary-100 mt-2">
            Intelligenter CRM-Assistent für den B2B-Vertrieb
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isRegister ? "Registrieren" : "Anmelden"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="label">Vollständiger Name</label>
                  <input
                    type="text"
                    {...register("full_name", {
                      required: "Name ist erforderlich",
                    })}
                    className="input"
                    placeholder="Max Mustermann"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Firmenname</label>
                  <input
                    type="text"
                    {...register("tenant_name", {
                      required: "Firmenname ist erforderlich",
                    })}
                    className="input"
                    placeholder="Meine Firma GmbH"
                  />
                  {errors.tenant_name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.tenant_name.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="label">E-Mail</label>
              <input
                type="email"
                {...register("email", {
                  required: "E-Mail ist erforderlich",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Ungültige E-Mail-Adresse",
                  },
                })}
                className="input"
                placeholder="max@firma.de"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Passwort</label>
              <input
                type="password"
                {...register("password", {
                  required: "Passwort ist erforderlich",
                  minLength: {
                    value: 6,
                    message: "Passwort muss mindestens 6 Zeichen lang sein",
                  },
                })}
                className="input"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? "Lädt..." : isRegister ? "Registrieren" : "Anmelden"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {isRegister
                ? "Bereits registriert? Jetzt anmelden"
                : "Noch kein Konto? Jetzt registrieren"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
