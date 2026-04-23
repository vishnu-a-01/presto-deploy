import type { ElementType, SlideElement } from "../../types/types";

interface ElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_: Partial<SlideElement>) => void;
  onChange: (_: Partial<SlideElement>) => void;
  initialData: SlideElement;
  elementType: ElementType;
}

export default function AddElementModal({
  isOpen,
  onClose,
  onSave,
  onChange,
  initialData,
  elementType,
}: ElementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-[#111] p-6 rounded-lg w-[320px] flex flex-col gap-3">
        <h2 className="font-semibold">
          {elementType === "image"
            ? "Add Image"
            : elementType === "video"
              ? "Add Video"
              : "Add Text"}
        </h2>

        {initialData.id && (
          <div className="flex gap-2">
            <div className="flex flex-col w-[50%]">
              <label className="text-xs text-gray-400 font-medium">x pos</label>
              <input
                type="number"
                className="input"
                value={initialData.x}
                onChange={(e) =>
                  onChange({ ...initialData, x: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col w-[50%]">
              <label className="text-xs text-gray-400 font-medium">y pos</label>
              <input
                type="number"
                className="input"
                value={initialData.y}
                onChange={(e) =>
                  onChange({ ...initialData, y: Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        {elementType === "text" && (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Text</label>
              <input
                className="input"
                value={initialData.text}
                onChange={(e) =>
                  onChange({ ...initialData, text: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">
                Font Family
              </label>
              <select
                className="input"
                value={initialData.fontFamily}
                onChange={(e) =>
                  onChange({ ...initialData, fontFamily: e.target.value })
                }
              >
                <option className="input" value="Arial">Arial</option>
                <option className="input" value="Roboto">Roboto</option>
                <option className="input" value="Times New Roman">Times New Roman</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">
                Font Size (em)
              </label>
              <input
                type="number"
                step="0.1"
                className="input"
                value={initialData.fontSize}
                onChange={(e) =>
                  onChange({
                    ...initialData,
                    fontSize: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Color</label>
              <input
                className="input"
                value={initialData.color}
                onChange={(e) =>
                  onChange({ ...initialData, color: e.target.value })
                }
              />
            </div>
          </>
        )}

        {(elementType === "image" || elementType === "video") && (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">URL</label>
              <input
                className="input"
                placeholder="https://..."
                value={initialData.url}
                onChange={(e) =>
                  onChange({ ...initialData, url: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-medium">
                ALT text
              </label>
              <input
                className="input"
                placeholder="Enter alt text"
                value={initialData.altText}
                onChange={(e) =>
                  onChange({ ...initialData, altText: e.target.value })
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
            value={initialData.width}
            onChange={(e) =>
              onChange({ ...initialData, width: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-medium">Height %</label>
          <input
            type="number"
            className="input"
            value={initialData.height}
            onChange={(e) =>
              onChange({ ...initialData, height: Number(e.target.value) })
            }
          />
        </div>

        <button className="btn btn-primary" onClick={() => onSave({...initialData, type: elementType})}>
          Save
        </button>
      </div>
    </div>
  );
}
