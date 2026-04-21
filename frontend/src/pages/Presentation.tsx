import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UpdateStore } from "../api/api";
import ErrorPopup from "./Error";

export default function Presentation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("My Presentation");
  const [thumbnail, setThumbnail] = useState("");
  const [editedThumbnail, setEditedThumbnail] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [showEditThumbnail, setShowEditThumbnail] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);

  const [slides, setSlides] = useState<Record<string, { id: string }>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showTextModal, setShowTextModal] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [textWidth, setTextWidth] = useState("");
  const [textHeight, setTextHeight] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    const presentations = JSON.parse(
      localStorage.getItem("presentations") || "[]",
    );
    const presentation = presentations[id!];

    setTitle(presentation.name);
    setThumbnail(presentation.thumbnail || "");
    setEditedThumbnail(presentation.thumbnail || "");

    if (presentation.slides && Object.keys(presentation.slides).length > 0) {
      setSlides(presentation.slides);
    } else {
      const newSlide = { id: crypto.randomUUID() };
      setSlides({ [newSlide.id]: newSlide });
    }
  }, []);

  useEffect(() => {
    setTextValue("");
    setTextWidth("");
    setTextHeight("");
    setFontSize("");
    setColor("");
  }, [showTextModal]);

  const saveSlides = async (newSlides: Record<string, any>) => {
    const presentations = JSON.parse(
      localStorage.getItem("presentations") || "[]",
    );

    presentations[id!].slides = newSlides;
    localStorage.setItem("presentations", JSON.stringify(presentations));

    try {
      await UpdateStore(JSON.parse(localStorage.getItem("user")!).token, {
        presentations,
      });
    } catch {
      setErrorMessage("Failed to update slides");
    }
  };

  const addSlide = () => {
    const newSlide = { id: crypto.randomUUID() };
    const newSlides = { ...slides, [newSlide.id]: newSlide };
    setSlides(newSlides);
    setCurrentIndex(Object.keys(newSlides).length - 1);
    saveSlides(newSlides);
  };

  const deleteSlide = () => {
    const keys = Object.keys(slides);

    if (keys.length === 1) {
      setErrorMessage("Delete presentation instead");
      return;
    }

    const newSlides = { ...slides };
    delete newSlides[keys[currentIndex]];

    setSlides(newSlides);
    setCurrentIndex(Math.max(0, currentIndex - 1));
    saveSlides(newSlides);
  };

  const goNext = () => {
    if (currentIndex < Object.keys(slides).length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, slides]);

  const updateThumbnail = async (newThumbnail: string) => {
    const presentations = JSON.parse(
      localStorage.getItem("presentations") || "[]",
    );
    presentations[id!].thumbnail = newThumbnail;
    localStorage.setItem("presentations", JSON.stringify(presentations));

    try {
      await UpdateStore(JSON.parse(localStorage.getItem("user")!).token, {
        presentations,
      });
      setThumbnail(newThumbnail);
      setShowEditThumbnail(false);
    } catch (err) {
      setErrorMessage("Failed to update thumbnail");
    }
  };
  const updateTitle = async (newTitle: string) => {
    const presentations = JSON.parse(
      localStorage.getItem("presentations") || "[]",
    );
    presentations[id!].name = newTitle;
    localStorage.setItem("presentations", JSON.stringify(presentations));

    try {
      await UpdateStore(JSON.parse(localStorage.getItem("user")!).token, {
        presentations,
      });
      setTitle(newTitle);
      setShowEditTitle(false);
    } catch (err) {
      setErrorMessage("Failed to update title");
    }
  };
  const deletePresentation = async () => {
    const presentations = JSON.parse(
      localStorage.getItem("presentations") || "[]",
    );
    delete presentations[id!];
    localStorage.setItem("presentations", JSON.stringify(presentations));

    try {
      await UpdateStore(JSON.parse(localStorage.getItem("user")!).token, {
        presentations,
      });
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("Failed to delete presentation");
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{title}</h1>
            <button onClick={() => setShowEditTitle(true)}>✏️</button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setShowEditThumbnail(true)}
          >
            Edit thumbnail
          </button>
        </div>

        <button
          className="btn bg-red-500 hover:bg-red-600"
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-2">
            <button
              className="icon-btn bg-white text-black rounded font-bold shadow"
              onClick={() => setShowTextModal(true)}
            >
              T
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex gap-4">
              <button className="btn btn-primary" onClick={addSlide}>
                + New Slide
              </button>

              <button
                className="btn bg-red-500 hover:bg-red-600"
                onClick={deleteSlide}
              >
                Delete Slide
              </button>
            </div>

            <div className="relative w-[70vw] max-w-[1400px] aspect-[2/1] bg-white/10 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Slide Content</p>

              <div className="absolute bottom-2 left-3 text-xs text-gray-400">
                {currentIndex + 1}
              </div>
            </div>

            {Object.values(slides).length > 1 && (
              <div className="flex gap-6">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2 rounded ${
                    currentIndex === 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-white text-black"
                  }`}
                >
                  ←
                </button>

                <button
                  onClick={goNext}
                  disabled={currentIndex === Object.values(slides).length - 1}
                  className={`px-4 py-2 rounded ${
                    currentIndex === Object.values(slides).length - 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-white text-black"
                  }`}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTextModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowTextModal(false)}
          />

          <div className="relative bg-[#111] p-6 rounded-lg w-[320px] flex flex-col gap-3">
            <h2 className="font-semibold">Add Text</h2>

            <input
              className="input"
              placeholder="Text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />

            <input
              type="number"
              className="input"
              placeholder="Width %"
              value={textWidth}
              onChange={(e) => setTextWidth(e.target.value)}
            />

            <input
              type="number"
              className="input"
              placeholder="Height %"
              value={textHeight}
              onChange={(e) => setTextHeight(e.target.value)}
            />

            <input
              type="number"
              step="0.1"
              className="input"
              placeholder="Font size (em)"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />

            <input
              className="input"
              placeholder="#HEX color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <button className="btn btn-primary">Add</button>
          </div>
        </div>
      )}

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

      {showEditTitle && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowEditTitle(false)}
          />

          <div className="relative bg-[#111] p-6 rounded-lg w-[300px] flex flex-col gap-3">
            <h2 className="font-semibold">Edit Title</h2>

            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              className="btn btn-primary"
              onClick={() => updateTitle(title)}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {showEditThumbnail && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setEditedThumbnail(thumbnail);
              setShowEditThumbnail(false);
            }}
          />

          <div className="relative bg-[#111] p-6 rounded-lg w-[300px] flex flex-col gap-3">
            <h2 className="font-semibold">Edit Thumbnail</h2>
            <img
              src={editedThumbnail || "https://via.placeholder.com/150"}
              alt="Thumbnail"
              className="w-full h-40 object-cover rounded"
            />
            <input
              className="input"
              placeholder="Thumbnail URL"
              value={editedThumbnail}
              onChange={(e) => setEditedThumbnail(e.target.value)}
            />

            <button
              className="btn btn-primary"
              onClick={() => updateThumbnail(editedThumbnail)}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {error && (
        <ErrorPopup message={error} onClose={() => setErrorMessage(null)} />
      )}
    </div>
  );
}
