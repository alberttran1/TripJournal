import React, { useState, useRef, useEffect } from "react";
import { FaSpinner } from "react-icons/fa6";

type InlineTextInputProps = {
  value: string;
  className: string;
  onSave: (newValue: string) => Promise<void>;
  maxWidthVW?: number;
};

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 60;

const InlineTextInput: React.FC<InlineTextInputProps> = ({
  value,
  className,
  onSave,
  maxWidthVW = 50,
}) => {
  const [text, setText] = useState(value);
  const [lastText, setLastText] = useState(value);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);

  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const measureAndAdjustFont = () => {
    const maxPixelWidth = (maxWidthVW / 100) * window.innerWidth;

    if (!spanRef.current || !inputRef.current) return;

    let newFontSize = MAX_FONT_SIZE;
    let spanWidth = 0;

    // Try decreasing font size step by step
    for (let size = MAX_FONT_SIZE; size >= MIN_FONT_SIZE; size--) {
      spanRef.current.style.fontSize = `${size}px`;
      spanWidth = spanRef.current.scrollWidth;

      if (spanWidth <= maxPixelWidth) {
        newFontSize = size;
        break;
      }
    }

    setFontSize(newFontSize);
    inputRef.current.style.width = `${spanWidth + 10}px`;
    
  };

  useEffect(() => {
   
    // Defer so DOM can update the span before measuring
    requestAnimationFrame(measureAndAdjustFont);

    window.addEventListener("resize", measureAndAdjustFont)

    return () => {
      window.removeEventListener("resize", measureAndAdjustFont)
    }
  }, [text, maxWidthVW]);

  const handleBlur = async () => {
    if (text === lastText) return;
    if (text === "") {
      setText(lastText);
      return;
    }
    setLoading(true);
    try {
      await onSave(text);
      setLastText(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-baseline md:items-center relative overflow-visible">
        <input
          maxLength={25}
          ref={inputRef}
          type="text"
          className="bg-transparent font-semibold focus:outline-none border-none caret-white transition-all duration-150 overflow-visible"
          style={{ fontSize }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
        />
        <span
          ref={spanRef}
          className="absolute invisible whitespace-pre font-semibold"
          aria-hidden="true"
        >
          {text || " "}
        </span>
        {loading && <FaSpinner className="ml-8 animate-spin" />}
      </div>
    </div>
  );
};

export default InlineTextInput;
