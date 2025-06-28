import React from "react";
import type { Trip } from "../types";
import { useNavigate } from "react-router-dom";


const HorizontalScrollTripCards: React.FC<{ trips?: Trip[] }> = ({ trips }) => {
  const navigate = useNavigate()
  return (
    <div className="w-full overflow-x-auto hide-scrollbar -translate-x-[4rem] pr-[6rem]"
    style={{
      WebkitMaskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      maskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
    }}>
      <div
        className="flex gap-4 mx-2 py-20 w-max"
      >
        {trips?.map((trip) => (
            <div
              key={"Trip_Card_" + trip._id}
              className="
                        bg-gradient-to-br from-amber-200 to-yellow-100
                        rounded-xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transition-colors 
                        left-10 top-0 z-1 relative h-[20vh] w-[25vh]
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
