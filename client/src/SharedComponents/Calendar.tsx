import React from "react";


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

interface CalendarProps {
    month: number,
    year: number,
    activeLowerBound?: Date,
    activeUpperBound?: Date,
    onClickDay?: (day: Date) => void;
    selectedDate?: Date
}

const Calendar: React.FC<CalendarProps> = ({month, year, activeLowerBound, activeUpperBound, onClickDay, selectedDate}) => {

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const matrix = getCalendarMatrix(year, month);


  return (
    <div className="
                    group w-[90vw] md:w-[50vw] h-[55vh] mx-auto p-4 shadow rounded-xl                                
                    bg-gradient-to-r from-[#8DD8FF] to-[#4E71FF]
                    ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[3vh] font-bold  text-white opacity-80 group-hover:opacity-100">
          {monthNames[month]} {year}
        </h2>

      </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[2vh] font-semibold text-white opacity-80">
        {weekDays.map((day) => (
            <div key={day}>{day}</div>
        ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm mt-2">
        {matrix.flat().map((day, idx) => {
          const date = new Date(year, month, day || undefined)
          const dayIsActive = (!activeLowerBound || activeLowerBound <= date) && (!activeUpperBound || activeUpperBound >= date)
          const dayIsSelected = date.getTime() === selectedDate?.getTime()

          return(
            <div
            key={idx}
            onClick={() => {
              if(!onClickDay || !dayIsActive) return; 
              onClickDay(date)}
            }
            className={`h-[6vh] text-[2vh] flex items-center justify-center rounded-md shadow opacity-40 transition-all
              ${
                day
                ? `bg-white text-gray-400 opacity-10`
                : "bg-transparent border-none shadow-none"
              }

              ${
               dayIsActive
                // ? "bg-gradient-to-r from-[#BFECFF] to-[#CDC1FF] opacity-100"
                ? " opacity-80 hover:opacity-100 cursor-pointer"
                : ""
              }

              ${
                dayIsSelected 
                ? " bg-gradient-to-r from-[#FFAAAA] to-[#FFD586] text-white opacity-100"
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

export default Calendar;
