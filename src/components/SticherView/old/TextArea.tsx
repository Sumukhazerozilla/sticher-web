import React, { useEffect, useState } from "react";

interface ITextAreaProps {
  text: string;
  id: string;
  editSlideText: (id: string, text: string) => void;
}

const TextArea: React.FC<ITextAreaProps> = ({ text, editSlideText, id }) => {
  const [textValue, setTextValue] = useState("");
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    setTextValue(text);
  }, [text]);

  return (
    <textarea
      className={`outline-1 outline-transparent border-none shadow-none focus:outline-gray-400 mt-1 text-sm p-1`}
      value={textValue}
      onFocus={() => setFocused(true)}
      onChange={(e) => setTextValue(e.target.value)}
      onBlur={() => {
        editSlideText(id, textValue);
        setFocused(false);
      }}
      rows={isFocused ? 2.5 : 1}
    ></textarea>
  );
};

export default TextArea;
