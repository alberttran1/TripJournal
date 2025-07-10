import React, { useState } from 'react'
import type { Trip } from '../types';
import { useNavigate } from 'react-router-dom';
import HoverMoveContainer from '../SharedComponents/HoverMoveContainer';
import { FaArrowLeft } from 'react-icons/fa6';
import CalendarDateSelector from '../SharedComponents/CalendarDateSelector';
import { createTrip, editTrip } from '../Api/tripApi';

type SelectDateScreenProps = {
    asComponent? : false,
} | {
    asComponent : true,
    exitDateScreen : () => void
    trip : Trip
    setTrip: (trip: Trip) => void
}

const SelectDateScreen: React.FC<SelectDateScreenProps> = (props) => {
    
    let sDate;
    let eDate
    if(props.asComponent) {
        sDate = props.trip.startDate
        eDate = props.trip.endDate
    }
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const [startDate, setStartDate] = useState<Date | undefined>(sDate);
    const [endDate, setEndDate] = useState<Date | undefined>(eDate);

    const navigate = useNavigate()

    const selectDay = (day : Date) => {
        if(!startDate || day < startDate || (startDate && endDate && endDate !== startDate)) {
            setStartDate(day)
            setEndDate(day)
        } else if (day.getTime() != startDate.getTime()) {
            setEndDate(day)
        }
    }
    
  return (
    <div className='flex flex-col w-[100vw] h-[100vh] justify-center items-center'>
       <div className='absolute'>
            <HoverMoveContainer
                className='w-screen h-screen md:w-[calc(100vw-1rem)] md:h-[calc(100vh-1rem)] 
                    bg-gradient-to-r from-[#BFECFF] to-[#CDC1FF]
                    md:rounded-xl shadow-xl 
                    flex items-center justify-center
                 '
                sensitivity={isMobile ? 0 : 0.2}
                >
                <div className='absolute top-[2rem] left-[2rem]'>
                    <HoverMoveContainer
                        sensitivity={0.2}
                        className='text-gray-100 text-4xl hover:text-white transition cursor-pointer'
                    >
                        <div onClick={() => {
                            if(props.asComponent) props.exitDateScreen()
                            else navigate(-1)
                        }}>
                            <FaArrowLeft/>
                        </div>
                    </HoverMoveContainer>
                </div>
            </HoverMoveContainer>
        </div>
        <div className='flex gap-[5vw] items-center'>
            <div className='flex flex-col items-center gap-[2vh]'>
                <HoverMoveContainer 
                    className='
                    flex items-center justify-center
                    '
                    sensitivity={isMobile ? 0.2 : 0.4}
                    tiltSensitivity={0.2}
                    whileHover={{scale: 1.1}}
                    doesTilt
                    initial={{opacity: 0, y: -100}}
                    >
                    <div className='text-4xl md:text-[10vh] font-bold  text-white'>
                        Select trip dates
                    </div>

                </HoverMoveContainer>
                <HoverMoveContainer 
                    className='
                    flex items-center justify-center
                    w-[90vw]
                    '
                    sensitivity={isMobile ? 0.2 : 0.4}
                    tiltSensitivity={0.2}
                    whileHover={{scale: 1.1}}
                    doesTilt
                    initial={{opacity: 0, y: -100}}
                    >
                    <CalendarDateSelector selectedStart={startDate} selectedEnd={endDate} onClickDay={selectDay}/>

                </HoverMoveContainer>
                <HoverMoveContainer 
                    className='
                    flex items-center justify-center
                    '
                    sensitivity={0.4}
                    tiltSensitivity={0.2}
                    doesTilt
                    initial={{opacity: 0, y: -100}}
                    >
                    <div
                        
                        onClick={async () => {
                            if(!startDate) return;
                            if(props.asComponent) {
                                await editTrip(props.trip._id,
                                {
                                    ...props.trip, 
                                    startDate : startDate.toDateString(), 
                                    endDate: endDate?.toDateString()
                                })

                                props.exitDateScreen()
                            }
                            else {
                                const res = await createTrip({
                                    title: "My Trip",
                                    startDate: startDate.toDateString(),
                                    endDate: endDate?.toDateString(),
                                })
                                navigate(`/trip/${res._id}`,)
                            }
                        }}
                        className={`
                            font-semibold mt-[2vh] py-2 px-6 rounded-4xl shadow-md 
                            transition-transform duration-300
                            focus:outline-none hover:outline-none
                            ${startDate ? "bg-white text-gray-400 cursor-pointer hover:scale-105 hover:shadow-lg" : "bg-gray-200 text-white cursor-not-allowed opacity-80"}
                        `}
                        >
                        Confirm
                    </div>

                </HoverMoveContainer>
            </div>
        </div>
    </div>
  )
}

export default SelectDateScreen