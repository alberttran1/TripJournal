import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { FaEllipsisVertical } from 'react-icons/fa6'

interface OptionsDropdownProps {
    children : ReactNode
}

const OptionsDropdown : React.FC<OptionsDropdownProps> = ({children}) => {
    const [open, setOpen] = useState<boolean>()
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


  return (
    <div className={`relative inline-block`} ref={ref}>
        <div 
            className='hover:opacity-100 opacity-80 transition-opacity text-white cursor-pointer'
            onClick={() => setOpen((prev) => !prev)}
            >
            <FaEllipsisVertical size={25} color='inherit'/>
        </div>  
        {open && (
            <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-md">
                {children}
            </ul>
        )}
    </div>
    )
}

export default OptionsDropdown