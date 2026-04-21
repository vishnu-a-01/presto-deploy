import type { SlideElement } from "../../types/types";

interface ElementProps {
  el: SlideElement;
  onDelete: (id: string) => void;
  onEdit: (el: SlideElement) => void;
}

export default function SlElement({ el, onDelete, onEdit }: ElementProps) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: `${el.y}%`,
    left: `${el.x}%`,
    width: `${el.width}%`,
    height: `${el.height}%`,
    border: "1px solid #888",
    overflow: "hidden",
  };

  const renderContent = () => {
    switch (el.type) {
      case "text":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              fontSize: `${el.fontSize}em`,
              color: el.color,
              overflow: "auto",
            }}
          >
            {el.text}
          </div>
        );

      case "image":
        return (
          <img
            src={el.url}
            alt={el.altText || "Image"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        );

      case "video":
        return (
          <>
            <div className="absolute top-1 right-1 w-4 h-4 bg-white cursor-pointer z-10" />
            <iframe
              src={el.url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(el.id);
      }}
      onDoubleClick={() => onEdit(el)}
      style={baseStyle}
    >
      {renderContent()}
    </div>
  );
}
