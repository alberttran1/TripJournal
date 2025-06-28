import React, { useRef, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useDebounce } from "../Hooks/useDebounce";

type InlineTextAreaInputProps = {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  className?: string;
  placeholder?: string;
};

const InlineTextAreaInput: React.FC<InlineTextAreaInputProps> = ({
  value,
  onSave,
  className = "",
  placeholder = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce(internalValue, 1500);

useEffect(() => {
  if (debouncedValue) {
    onSave(debouncedValue); // your async save function
  }
}, [debouncedValue]);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [internalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
  };

  const handleBlur = async () => {
    setLoading(true);
    await onSave(internalValue);
    setLoading(false);

  };

  return (
    <>
        <textarea
        ref={textareaRef}
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        onBlur={handleBlur}
        className={`resize-none overflow-y-auto bg-transparent focus:outline-none ${className}`}
        rows={1}
        />
        {loading && <FaSpinner className="ml-2 animate-spin text-white" />}
    </>
  );
};

export default InlineTextAreaInput;
