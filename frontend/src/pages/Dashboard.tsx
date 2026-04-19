import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

type Presentation = {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  slides: { id: string }[];
};
export default function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const createPresentation = () => {
    if (!name.trim()) return;

    const newPresentation: Presentation = {
      id: crypto.randomUUID(),
      name,
      description,
      thumbnail,
      slides: [{ id: crypto.randomUUID() }],
    };

    setPresentations((prev) => [...prev, newPresentation]);
    setName("");
    setDescription("");
    setThumbnail("");
    setIsOpen(false);
  };
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

            <button className="btn btn-primary" onClick={createPresentation}>
              Create
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
        {presentations.map((p) => (
          <div
            className="aspect-[2/1] relative rounded-lg overflow-hidden bg-gray-700 cursor-pointer"
            key={p.id}
            onClick={() => navigate(`/presentation/${p.id}`)}
          >
            {p.thumbnail && (
              <img
                src={p.thumbnail}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {!p.thumbnail && <div className="absolute inset-0 bg-gray-600" />}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-3 text-white">
              <h2 className="font-semibold">{p.name}</h2>

              <p className="text-xs text-gray-300">
                {p.description || ""}
              </p>

              <p className="text-xs mt-1 text-gray-400">
                Slides: {p.slides.length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
