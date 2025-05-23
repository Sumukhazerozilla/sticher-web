import { useEffect, useState } from 'react';
import { ISlideData } from '../../types';

interface TextFieldProps {
  slide: ISlideData;
  editSlideText: (id: string, text: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({ slide, editSlideText }) => {
  const [inputValue, setInputValue] = useState(slide.text);

  useEffect(() => {
    setInputValue(slide.text);
  }, [slide.text]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={(e) => {
        const newText = e.target.value;
        if (newText.trim() === '') {
          setInputValue(slide.text);
          return;
        }
        editSlideText(slide.id, inputValue.length === 0 ? slide.text : newText);
      }}
      className="text-sm mt-1 font-semibold h-7 border border-transparent outline-none focus:border-blue-300"
      style={{ color: 'rgba(0, 0, 0, 0.88)' }}
    />
  );
};

export default TextField;
