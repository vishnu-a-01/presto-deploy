import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UpdateStore } from "../api/api";
import ErrorPopup from "./Error";
import AddElementModal from "./components/AddElementModal";
import type { SlideElement, Slides } from "../types/types";

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

  const [slides, setSlides] = useState<Slides>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showTextModal, setShowTextModal] = useState(false);

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
      const newSlideId = crypto.randomUUID();
      setSlides({
        [newSlideId]: { id: newSlideId, position: 0, elements: [] },
      });
    }
  }, []);

  const orderedSlides = Object.values(slides).sort(
    (a, b) => a.position - b.position,
  );

  const getCurrentSlide = () => orderedSlides[currentIndex];

  const saveSlides = async (newSlides: Slides) => {
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

  const reindexSlides = (slides: Slides) => {
    return Object.values(slides)
      .sort((a, b) => a.position - b.position)
      .reduce(
        (acc, slide, idx) => {
          acc[slide.id] = { ...slide, position: idx };
          return acc;
        },
        {} as Slides,
      );
  };

  const addSlide = () => {
    const newId = crypto.randomUUID();
    const newSlidesTemp = {
      ...slides,
      [newId]: {
        id: newId,
        position: Object.keys(slides).length,
        elements: [],
      },
    };
    const newSlides = reindexSlides(newSlidesTemp);
    setSlides(newSlides);
    setCurrentIndex(Object.keys(newSlides).length - 1);
    saveSlides(newSlides);
  };

  const deleteSlide = () => {
    const keys = orderedSlides.map((s) => s.id);

    if (keys.length === 1) {
      setErrorMessage("Delete presentation instead");
      return;
    }

    const newSlides = { ...slides };
    delete newSlides[keys[currentIndex]];

    const reindexed = reindexSlides(newSlides);

    setSlides(reindexed);
    setCurrentIndex(Math.max(0, currentIndex - 1));
    saveSlides(reindexed);
  };

  const goNext = () => {
    if (currentIndex < orderedSlides.length - 1) {
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

  const addTextElement = (slideData: Partial<SlideElement>) => {
    const keys = orderedSlides.map((s) => s.id);
    const slideId = keys[currentIndex];
    const slide = slides[slideId];

    const last = slide.elements[slide.elements.length - 1];

    const newEl = {
      id: crypto.randomUUID(),
      type: "text" as const,
      x: 0,
      y: last ? last.y + last.height + 1 : 0,
      width: Number(slideData.width) || 20,
      height: Number(slideData.height) || 10,
      text: slideData.text || "",
      fontSize: Number(slideData.fontSize) || 1,
      color: slideData.color || "#ffffff",
      layer: slide.elements.length,
    };

    const newSlides = {
      ...slides,
      [slideId]: {
        ...slide,
        elements: [...slide.elements, newEl],
      },
    };

    setSlides(newSlides);
    saveSlides(newSlides);
    setShowTextModal(false);
  };

  const deleteElement = (elId: string) => {
    const keys = orderedSlides.map((s) => s.id);
    const slideId = keys[currentIndex];
    const slide = slides[slideId];

    const newSlides = {
      ...slides,
      [slideId]: {
        ...slide,
        elements: slide.elements.filter((e) => e.id !== elId),
      },
    };

    setSlides(newSlides);
    saveSlides(newSlides);
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
              {getCurrentSlide()?.elements?.map((el) => (
                <div
                  key={el.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    deleteElement(el.id);
                  }}
                  style={{
                    position: "absolute",
                    top: `${el.y}%`,
                    left: `${el.x}%`,
                    width: `${el.width}%`,
                    height: `${el.height}%`,
                    fontSize: `${el.fontSize}em`,
                    color: el.color,
                    border: "1px solid #888",
                    overflow: "auto",
                  }}
                >
                  {el.text}
                </div>
              ))}

              <div className="absolute bottom-2 left-3 text-xs text-gray-400">
                {currentIndex + 1}
              </div>
            </div>

            {orderedSlides.length > 1 && (
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
                  disabled={currentIndex === orderedSlides.length - 1}
                  className={`px-4 py-2 rounded ${
                    currentIndex === orderedSlides.length - 1
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
        <AddElementModal
          isOpen={showTextModal}
          onClose={() => setShowTextModal(false)}
          onSave={addTextElement}
        />
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
