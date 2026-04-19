import { useAuth } from "../AuthContext";

export default function Dashboard() {
    const auth = useAuth();
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-8">
          <button className="btn btn-primary" onClick={() => 0}>
            New Presentation
          </button>

          <button className="btn btn-logout" onClick={auth.logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
