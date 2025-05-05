import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  x: number;
  y: number;
  text: string;
  onTextUpdate: (text: string) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, text, onTextUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onTextUpdate(editText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditText(text);
      setIsEditing(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node) &&
      isEditing
    ) {
      handleSave();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editText]);

  // Update local text when prop changes
  useEffect(() => {
    setEditText(text);
  }, [text]);

  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -110%)", // Ensure tooltip appears above the point
        zIndex: 50,
      }}
    >
      <div ref={containerRef} className="flex flex-col items-center">
        <div
          className={`bg-indigo-600 text-white p-3 rounded-lg shadow-lg max-w-xs mb-2
            ${isEditing ? "border-2 border-white" : ""}`}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <textarea
              ref={inputRef}
              className="bg-indigo-700 text-white p-1 w-full min-w-[150px] min-h-[60px] focus:outline-none rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
            />
          ) : (
            <p className="whitespace-pre-wrap">{text}</p>
          )}
        </div>
        {/* Arrow pointing down to the point */}
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-indigo-600 mb-1"></div>
        {/* Point indicator */}
        <div className="w-3 h-3 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full bg-red-500 border-2 border-white"></div>
      </div>
    </div>
  );
};

export default Tooltip;
