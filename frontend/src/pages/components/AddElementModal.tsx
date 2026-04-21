import { useEffect, useState } from "react";
import type { ElementType, SlideElement } from "../../types/types";

interface ElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<SlideElement>) => void;
  initialData?: SlideElement | null;
  elementType?: ElementType;
}

export default function AddElementModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  elementType,
}: ElementModalProps) {
  const [formData, setFormData] = useState<Partial<SlideElement>>({
    type: "text",
    x: 0,
    y: 0,
    width: 20,
    height: 10,
    text: "",
    fontSize: 1,
    color: "#ffffff",
    url: "",
    altText: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        type: elementType || "text",
        x: 0,
        y: 0,
        width: 20,
        height: 10,
        text: "",
        fontSize: 1,
        color: "#ffffff",
        url: "",
        altText: "",
      });
    }
  }, [initialData, isOpen, elementType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-[#111] p-6 rounded-lg w-[320px] flex flex-col gap-3">
        <h2 className="font-semibold">
          {formData.type === "image"
            ? "Add Image"
            : formData.type === "video"
              ? "Add Video"
              : "Add Text"}
        </h2>

        {initialData && (
          <div className="flex gap-2">
            <div className="flex flex-col w-[50%]">
              <label className="text-xs text-gray-400 font-medium">x pos</label>
              <input
                type="number"
                className="input"
                value={formData.x}
                onChange={(e) =>
                  setFormData({ ...formData, x: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col w-[50%]">
              <label className="text-xs text-gray-400 font-medium">y pos</label>
              <input
                type="number"
                className="input"
                value={formData.y}
                onChange={(e) =>
                  setFormData({ ...formData, y: Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        {formData.type === "text" && (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Text</label>
              <input
                className="input"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">
                Font Size (em)
              </label>
              <input
                type="number"
                step="0.1"
                className="input"
                value={formData.fontSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fontSize: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Color</label>
              <input
                className="input"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </div>
          </>
        )}

        {(formData.type === "image" || formData.type === "video") && (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">URL</label>
              <input
                className="input"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">ALT text</label>
              <input
                className="input"
                placeholder="Enter alt text"
                value={formData.altText}
                onChange={(e) =>
                  setFormData({ ...formData, altText: e.target.value })
                }
              />
            </div>
          </>
        )}

        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-medium">Width %</label>
          <input
            type="number"
            className="input"
            value={formData.width}
            onChange={(e) =>
              setFormData({ ...formData, width: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-medium">Height %</label>
          <input
            type="number"
            className="input"
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: Number(e.target.value) })
            }
          />
        </div>

        <button className="btn btn-primary" onClick={() => onSave(formData)}>
          Save
        </button>
      </div>
    </div>
  );
}
