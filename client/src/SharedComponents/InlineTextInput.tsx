import React, { useState, useRef, useEffect } from "react";
import { FaSpinner } from "react-icons/fa6";

type InlineTextInputProps = {
  value: string;
  className: string;
  onSave: (newValue: string) => Promise<void>; // Simulate async save
};

const InlineTextInput: React.FC<InlineTextInputProps> = ({ value, className, onSave }) => {
  const [text, setText] = useState(value);
  const [lastText, setLastText] = useState(value);
  const [loading, setLoading] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth + 2}px`;
    }
  }, [text]);

  const handleBlur = async () => {
    if(text === lastText) return
    if(text === "") {
      setText(lastText)
      return
    }
    setLoading(true);
    try {
      await onSave(text);
      setLastText(text)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center relative">
        <input
          maxLength={20}
          ref={inputRef}
          type="text"
          className="bg-transparent font-semibold focus:outline-none border-none caret-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
        />
        {/* Hidden span to measure text width */}
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
