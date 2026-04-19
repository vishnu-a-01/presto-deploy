import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UpdateStore } from "../api/api";
import ErrorPopup from "./Error";

export default function Presentation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("My Presentation");
  const [showDelete, setShowDelete] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);

  const deletePresentation = async () => {
    const presentations = JSON.parse(
      localStorage.getItem("presentations") || "[]",
    );
    const updated = presentations.filter((p: any) => p.id !== id);
    localStorage.setItem("presentations", JSON.stringify(updated));

    try {
      await UpdateStore(JSON.parse(localStorage.getItem("user")!).token, {
        presentations: updated,
      });
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("Failed to delete presentation");
    }
  };

  useEffect(() => {
    const presentations = JSON.parse(
      localStorage.getItem("presentations") || "[]",
    );
    const presentation = presentations.find((p: any) => p.id === id);

    setTitle(presentation.name);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>

          <button
            className="text-sm text-gray-400 hover:text-white"
            onClick={() => {}}
          >
            ✏️
          </button>
        </div>
        <button
          className="btn bg-red-500 text-white hover:bg-red-600"
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>
      </div>

      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowDelete(false)}
          />

          <div className="relative bg-[#111] p-6 rounded-lg w-[250px] text-center">
            <p className="mb-4">Are you sure?</p>

            <div className="flex gap-2 justify-center">
              <button className="btn bg-red-500" onClick={deletePresentation}>
                Yes
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowDelete(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <ErrorPopup message={error} onClose={() => setErrorMessage(null)} />
      )}
    </div>
  );
}
