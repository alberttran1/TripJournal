import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";


// Weekday labels
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Get all days for a given month/year
const getCalendarMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const matrix: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  let day = 1;

  while (day <= daysInMonth) {
    week.push(day);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    day++;
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }

  return matrix;
};

interface CalendarDateSelectorProps {
  selectedStart?: Date | null, 
  selectedEnd?: Date | null
  onClickDay?: (day: Date) => void;
}

const CalendarDateSelector: React.FC<CalendarDateSelectorProps> = ({selectedStart,selectedEnd, onClickDay}) => {
  const today = new Date();
  const startingDate = selectedStart || today
  const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startingDate.getFullYear());

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };
  
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const matrix = getCalendarMatrix(currentYear, currentMonth);


  return (
    <div className="
                    group min-w-xl w-[50vw] h-[55vh] mx-auto p-4 shadow rounded-xl                                
                    bg-gradient-to-r from-[#8DD8FF] to-[#4E71FF]
                    ">
      <div className="flex justify-between items-center mb-4">
        <div className="opacity-80 hover:opacity-100 cursor-pointer" onClick={goToPreviousMonth}>
          <FaArrowLeft size={30} color="white"/>
        </div>
        <h2 className="text-[3vh] font-bold  text-white opacity-80 group-hover:opacity-100">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="opacity-80 hover:opacity-100 cursor-pointer" onClick={goToNextMonth}>
          <FaArrowRight size={30} color="white" />
        </div>

      </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[2vh] font-semibold text-white opacity-80">
        {weekDays.map((day) => (
            <div key={day}>{day}</div>
        ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm mt-2">
        {matrix.flat().map((day, idx) => {
          const date = new Date(currentYear, currentMonth, day || undefined)
          const dayIsSelected = date.getTime() === selectedStart?.getTime() || date.getTime() === selectedEnd?.getTime()
          const dayInBetween = selectedStart && selectedEnd && day && selectedStart.getTime() < date.getTime() && date.getTime() < selectedEnd.getTime()

          return(
            <div
            key={idx}
            onClick={() => {
              if(!onClickDay) return; 
              onClickDay(date)}
            }
            className={`h-[6vh] text-[2vh] flex items-center justify-center rounded-md shadow opacity-40 transition-all
              ${
                day
                ? `${dayIsSelected ? "border-4 border-yellow-400 bg-white" : "" } bg-white text-gray-400 hover:opacity-100 cursor-pointer`
                : "bg-transparent border-none shadow-none"
              }

              ${
               dayIsSelected || dayInBetween
                // ? "bg-gradient-to-r from-[#BFECFF] to-[#CDC1FF] opacity-100"
                ? "opacity-100"
                : ""
              }
            `}
            >
            {day || ""}
            </div>
          )})}
        </div>
    </div>
  );
};

export default CalendarDateSelector;
