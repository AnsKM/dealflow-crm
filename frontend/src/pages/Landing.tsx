import { Link } from "react-router-dom";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">DealFlow</h1>
        <p className="mt-4 text-primary-100">Intelligenter CRM-Assistent für den B2B-Vertrieb</p>
        <div className="mt-8">
          <Link to="/login" className="btn btn-primary inline-block">Jetzt starten</Link>
        </div>
      </div>
    </div>
  );
};
