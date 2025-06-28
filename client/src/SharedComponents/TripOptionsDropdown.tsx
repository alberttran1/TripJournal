import React, { useState, useRef, useEffect } from "react";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

interface TripOptionsDropdownProps {
  onDelete: () => void;
  onEdit: () => void;
}

const TripOptionsDropdown: React.FC<TripOptionsDropdownProps> = ({
  onDelete,
  onEdit,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        className="hover:opacity-100 opacity-80 transition-opacity text-white cursor-pointer"
        onClick={() => setOpen(prev => !prev)}
      >
        <FaEllipsisVertical size={25} color="inherit" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 overflow-hidden p-1 flex gap-1 flex-col">
          <button
            onClick={onDelete}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
          >
            <FaTrashAlt className="mr-2" />
            Delete Trip
          </button>
          <button
            onClick={onEdit}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <FaPencilAlt className="mr-2" />
            Edit Dates
          </button>
        </div>
      )}
    </div>
  );
};

export default TripOptionsDropdown;
