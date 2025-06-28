import React, { useEffect, useState } from 'react'
import HoverMoveContainer from '../SharedComponents/HoverMoveContainer';
import ImageUploader from '../SharedComponents/ImageUploader';
import InlineTextInput from '../SharedComponents/InlineTextInput';
import CalendarCarousel from '../SharedComponents/CalendarCarousel';
import DateCard from '../SharedComponents/DateCard';
import { useNavigate, useParams } from 'react-router-dom';
import type { Trip, UploadedImage } from '../types';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { deleteTrip, editTrip, getTrip } from '../Api/tripApi';
import { useAuth } from '../Context/AuthContext';
import TripOptionsDropdown from '../SharedComponents/TripOptionsDropdown';
import SelectDateScreen from './SelectDateScreen';

const TripScreen : React.FC = () => {
    const [trip, setTrip] = useState<Trip>();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const navigate = useNavigate()
    const { loading : userLoading } = useAuth()
    const { id } = useParams()

    const [modalImage, setModalImage] = useState<number>();
    const [modalMode, setModalMode] = useState<string>("");
    const [editDate, setEditDate] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    useEffect(() => {
        if (modalImage === undefined || trip === undefined) return;
      
        const handleKeyDown = (e: KeyboardEvent) => {
          const key = e.key;
      
          const dateKey = selectedDate?.toISOString().split("T")[0] || "";
          const imageList = trip.dateImages?.get(dateKey);
          const maxIndex = (imageList?.length ?? 1) - 1;
      
          if (key === "ArrowRight") {
            setModalImage(prev => {
              if (prev === undefined) return prev;
              return Math.min(prev + 1, maxIndex);
            });
          }
      
          if (key === "ArrowLeft") {
            setModalImage(prev => {
              if (prev === undefined) return prev;
              return Math.max(prev - 1, 0);
            });
          }
        };
      
        window.addEventListener("keydown", handleKeyDown);
      
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, [modalImage, selectedDate, trip]);
      

    useEffect(() => {
        const loadTrip = async () => {
            if (!id) return
            const res = await getTrip(id)
            setTrip({
                ...res,
                startDate: new Date(res.startDate),
                endDate: new Date(res.endDate),
                dateDescriptions: new Map<string, string>(
                    Object.entries(res.dateDescriptions)),
                dateImages: new Map<string, UploadedImage[]>(
                    Object.entries(res.dateImages)),
            })
        }
        if(!userLoading) loadTrip()
    },[id, userLoading])

    const changeTitle = async (title : string) => {
        if(!id) return
        await editTrip(id,{title: title})
    }
    
    const addImages = async (
        newImages: UploadedImage[]
      ) => {

        const tempMap = trip?.dateImages || new Map();
        for (const img of newImages) {
          const dateKey = img.takenAt
            ? img.takenAt.toISOString().split("T")[0] // e.g. "2025-06-03"
            : "Unknown";
      
          if (!tempMap?.has(dateKey)) {
            tempMap?.set(dateKey, []);
          }
      
          tempMap?.get(dateKey)!.push(img);
        }
        if(!trip?._id) return
        const newTrip = await editTrip(trip._id,{dateImages: Object.fromEntries(tempMap)})
        setTrip({                
            ...trip,
            dateImages: new Map<string, UploadedImage[]>(
                Object.entries(newTrip.dateImages))})
    }

    const setOrToggleDate = (date: Date) => {
        if(date.getTime() === selectedDate?.getTime()) setSelectedDate(undefined)
        else setSelectedDate(date)
    }
    
    if (!trip) return(
        <div className='flex flex-col w-[100vw] h-[100vh] justify-center items-center'>
        <div className='absolute'>
             <HoverMoveContainer
                 className='w-[calc(100vw-1rem)] h-[calc(100vh-1rem)] 
                     bg-gradient-to-r from-[#BFECFF] to-[#CDC1FF]
                     rounded-xl shadow-xl 
                     flex items-center justify-center
                  '
                 sensitivity={0.2}
                 >
                    <FaSpinner size={"20vh"} className="ml-2 animate-spin text-white my-20" />
                </HoverMoveContainer>
            </div>
        </div>
    )

    if(editDate) return (
        <SelectDateScreen 
            asComponent
            trip={trip}
            setTrip={setTrip}
            exitDateScreen={()=> setEditDate(false)}
        />
    )

  return (
    <div className='flex flex-col w-[100vw] h-[100vh] justify-center items-center'>
       <div className='absolute'>
            <HoverMoveContainer
                className='w-[calc(100vw-1rem)] h-[calc(100vh-1rem)] 
                    bg-gradient-to-r from-[#BFECFF] to-[#CDC1FF]
                    rounded-xl shadow-xl 
                    flex items-center justify-center
                 '
                sensitivity={0.2}
                >
                <div className='absolute top-[1rem] left-[1rem] md:top-[2rem] md:left-[2rem]'>
                    <HoverMoveContainer
                        sensitivity={0.2}
                        className='text-gray-100 text-4xl hover:text-white transition cursor-pointer'
                    >
                        <div onClick={() => navigate("/dashboard")}>
                            <FaArrowLeft/>
                        </div>
                    </HoverMoveContainer>
                </div>
            </HoverMoveContainer>
        </div>
        <div className='flex gap-[2vw] items-center flex-wrap justify-center overflow-scroll md:overflow-visible'>
            <div className='flex flex-col gap-[2vh] items-center min-w-[25rem]'>
                <div className='z-10'>
                    <HoverMoveContainer 
                        sensitivity={0.6}
                        tiltSensitivity={0.2}
                        whileHover={{scale: 1.1}}
                        doesTilt
                        initial={{opacity: 0, y: -100}}
                    >
                        <InlineTextInput
                            value={trip.title || "My Trip"} 
                            onSave={changeTitle}
                            className="
                            text-white 
                            text-7xl 
                            font-bold 
                            tracking-tight
                            opacity-100 
                            bg-transparent 
                            outline-none 
                            border-none 
                            focus:ring-0 
                            caret-white 
                            caret-10
                            "
                            />   
                    </HoverMoveContainer>
                </div>
                <div className='flex flex-col items-center gap-[2vh]'>
                    <CalendarCarousel startDate={trip.startDate} endDate={trip.endDate} dateOnClick={setOrToggleDate} selectedDate={selectedDate}/>
                </div>
            </div>
            <HoverMoveContainer 
                className='
                flex items-center justify-center
                '
                sensitivity={0.4}
                tiltSensitivity={0.2}
                whileHover={{scale: 1.1}}
                doesTilt
                initial={{opacity: 0, y: -100}}
                >
                    <div className='
                                w-[90vw] md:w-[35vw] h-[80vh] rounded-xl shadow-lg flex p-8
                                bg-gradient-to-r from-[#FFAAAA] to-[#FFD586]
                                min-w-[18rem]
                                '>
                        <div className='fade-edge flex flex-col gap-4 w-full overflow-y-scroll pb-[2rem]'>
                            {selectedDate &&
                                <DateCard date={selectedDate} trip={trip} setTrip={setTrip} setModalImage={setModalImage}/>
                            }
                            <div className={`flex gap-4 flex-col ${selectedDate && "hidden"}`}>
                                <div className='flex justify-between items-center'>
                                    <div className='text-white text-3xl tracking-tight opacity-100'>
                                        Images
                                    </div>
                                    <TripOptionsDropdown
                                        onDelete={() => {
                                            setModalMode("DELETE")
                                        }}
                                        onEdit={()=>{
                                            setEditDate(true)
                                        }}
                                    />
                                </div>
                                <ImageUploader addImages={addImages} loadingDescription={"Images are being uploaded to their respective dates!"}/>
                            </div>
                        </div>
                    </div>
            </HoverMoveContainer>
        </div>
        {/* Modal Viewer */}
        {modalMode && (
            <div className='fixed inset-0 max-w-full max-h-full flex justify-center items-center  z-50'>
            <div
            className="fixed inset-0  max-w-full max-h-full opacity-80 bg-black flex justify-center items-center z-50"
            onClick={() => setModalMode("")}
            >
            </div>
                {modalMode === "DELETE" && 
                <div className="z-51">
                    <HoverMoveContainer className='bg-white p-6 rounded-2xl shadow-xl w-full max-w-md'
                        sensitivity={0.4}
                        doesTilt
                    >

                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Are you sure you'd like to delete your trip?</h2>
                        <div className="mt-6 flex justify-end space-x-3">
                        <div
                            onClick={() => setModalMode("")}
                            className="px-4 py-2 text-sm rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 cursor-pointer"
                            >
                            Cancel
                        </div>
                        <div
                            onClick={async () => {
                                setDeleteLoading(true)
                                await deleteTrip(trip._id)
                                setDeleteLoading(false)
                                navigate("/dashboard")
                            }}
                            className="px-4 py-2 text-sm rounded-lg bg-red-200 hover:bg-red-500 text-white cursor-pointer flex justify-center items-center"
                            >
                            {deleteLoading ?
                             <FaSpinner size={"1rem"} className="animate-spin text-white" />
                            :
                            "Delete"
                            }
                        </div>
                        </div>
                    </HoverMoveContainer>
                </div>
                
                
                }

        </div>
        )}
      {modalImage !== undefined && selectedDate && trip && (
        <div className='fixed inset-0 max-w-full max-h-full flex justify-center items-center  z-50'>
            <div
            className="fixed inset-0  max-w-full max-h-full opacity-80 bg-black flex justify-center items-center z-50"
            onClick={() => setModalImage(undefined)}
            >
            </div>
            <img
                src={trip.dateImages?.get(selectedDate?.toISOString().split("T")[0])?.[modalImage].preview}
                alt="Modal Image"
                className="max-w-full max-h-[80vh] flex justify-center items-center z-51"
            />
            <div>
            </div>
        </div>
      )}
    </div>
  )
}

export default TripScreen