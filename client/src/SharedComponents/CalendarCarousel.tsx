import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "./Calendar";
import HoverMoveContainer from "./HoverMoveContainer";
import type { MonthYear, UploadedImage } from "../types";

interface CalendarCarouselProps { 
  startDate?: Date; 
  endDate?: Date, 
  dateOnClick? : (date: Date) => void
  selectedDate?: Date;
  dateToImageMap?: Map<string, UploadedImage[]>;
}

const CalendarCarousel: React.FC<CalendarCarouselProps> = ({
  startDate,
  endDate,
  dateOnClick,
  selectedDate
}) => {
  const [selected, setSelected] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function getMonthYearRange(startDate?: Date, endDate?: Date): MonthYear[] {
    const result: MonthYear[] = [];
    if(!startDate) return result
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    if (!endDate) {
      return [{ month: start.getMonth(), year: start.getFullYear() }];
    }

    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (start <= end) {
      result.push({ month: start.getMonth(), year: start.getFullYear() });
      start.setMonth(start.getMonth() + 1);
    }

    return result;
  }

  const calendarRange = getMonthYearRange(startDate, endDate);

  const handleScroll = (dir: "up" | "down") => {
    setSelected((prev) => {
      if (dir === "up") return prev > 0 ? prev - 1 : prev;
      return prev < calendarRange.length - 1 ? prev + 1 : prev;
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation(); 
      if (e.deltaY > 0) {
        handleScroll("down");
      } else if (e.deltaY < 0) {
        handleScroll("up");
      }
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[55vh] w-[50vw] flex flex-col items-center justify-center relative"
    >
      <div className="flex flex-col items-center absolute top-0">
          {calendarRange.map((monthYear, index) => {
            const isSelected = index === selected;
            const offset = index - selected;
            const distance = Math.abs(index - selected);

            return (
              <motion.div
                key={`CalendarRange_${index}`}
                initial={{ opacity: 0, scale: 0.8, y: 0 }}
                animate={{
                  opacity: isSelected ? 1 : distance > 1 ? 0 : 0.2,
                  // opacity: 1,
                  scale: isSelected ? 1 : 1 * 0.95,
                  y: `${10 * offset}vh`,
                  zIndex: calendarRange.length - distance,
                }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`text-2xl font-semibold absolute ${
                  isSelected ? "text-white" : "text-gray-400 cursor-pointer"
                } 
                `}
                onClick={() => {
                  if(!isSelected)setSelected(index)
                }}
              >
                <HoverMoveContainer
                    className={`flex items-center justify-center
                    ${distance > 1 ? "hidden pointer-events-none" : ""}
                    `}
                    sensitivity={1 - distance * 0.2}
                    tiltSensitivity={isSelected ? 1 : 0}
                    initial={{ y: -100}}
                    >
                  <Calendar
                    month={monthYear.month}
                    year={monthYear.year}
                    activeLowerBound={startDate}
                    activeUpperBound={endDate}
                    onClickDay={dateOnClick}
                    selectedDate={selectedDate}
                    />
                  </HoverMoveContainer>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default CalendarCarousel;
