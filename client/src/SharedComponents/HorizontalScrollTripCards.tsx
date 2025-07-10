import React from "react";
import type { Trip } from "../types";
import { useNavigate } from "react-router-dom";


const HorizontalScrollTripCards: React.FC<{ trips?: Trip[] }> = ({ trips }) => {
  const navigate = useNavigate()
  return (
    <div className="max-w-[90vw] md:w-full overflow-x-auto hide-scrollbar -translate-x-[2rem] md:-translate-x-[4rem] md:pr-[6rem]"
    style={{
      WebkitMaskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      maskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
    }}>
      <div
        className="flex flex-row gap-4 mx-2 md:py-20 w-max"
      >
        {trips?.map((trip) => (
            <div
              key={"Trip_Card_" + trip._id}
              className="
                        bg-gradient-to-br from-amber-200 to-yellow-100
                        rounded-xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transition-colors 
                        left-[2rem] md:left-[4rem] top-0 z-1 relative h-[20vh] w-[25vh]
              min-w-[200px] bg-white text-black rounded-xl shadow-md p-4 hover:scale-105 transition-transform duration-300 ease-out"
              onClick={() => navigate(`/trip/${trip._id}`)}
              >
              <h2 className="text-[2vh] font-semibold">{trip.title}</h2>
            </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollTripCards;
