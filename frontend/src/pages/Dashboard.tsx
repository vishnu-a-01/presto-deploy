import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const auth = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-8">
          <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
            New Presentation
          </button>

          <button className="btn btn-logout" onClick={auth.logout}>
            Logout
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-[#111] p-6 rounded-lg w-[320px] flex flex-col gap-3">
            <h2 className="text-lg font-bold">New Presentation</h2>

            <input
              className="px-3 py-2 rounded bg-white/10"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="px-3 py-2 rounded bg-white/10"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="px-3 py-2 rounded bg-white/10"
              placeholder="Thumbnail URL (optional)"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />

            <button className="btn btn-primary" onClick={() => 0}>
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
