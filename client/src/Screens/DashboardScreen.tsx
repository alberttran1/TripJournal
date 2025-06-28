import { useEffect, useState } from 'react'
import HoverMoveContainer from '../SharedComponents/HoverMoveContainer'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import JournalCard from '../SharedComponents/JournalCard'
import { getTrips } from '../Api/tripApi'
import HorizontalScrollTripCards from '../SharedComponents/HorizontalScrollTripCards'
import { FaSpinner } from 'react-icons/fa6'

const DashboardScreen = () => {
    const t = new Date();
    const { user, loading: userLoading } = useAuth();
    const [tripsLoading, setTripsLoading] = useState(false);
    const navigate = useNavigate()

    const [trips, setTrips] = useState([])

    useEffect(() => {
        const loadTrips = async () => {
            setTripsLoading(true)
            const res = await getTrips()
            setTrips(res)
            setTripsLoading(false)
        }
        if (!userLoading) loadTrips()
    },[userLoading])

  return (
    <div className='flex flex-col w-[100vw] h-[100vh] justify-center items-center'>
       <div className='absolute z-[-1]'>
            <HoverMoveContainer 
                className='w-[calc(100vw-1rem)] h-[calc(100vh-1rem)] 
                    bg-gradient-to-r from-[#BFECFF] to-[#CDC1FF]
                    rounded-xl shadow-xl 
                    flex items-center justify-center
                 '
                sensitivity={0.2}
                >
                <div className=''>
                </div>
            </HoverMoveContainer>
        </div>
        <div className=' flex gap-4 min-w-[50rem]'>
            <div className='w-[40vw] flex flex-col gap-[10vh]'>
                <HoverMoveContainer
                    doesTilt
                    sensitivity={0.3}>
                    {!userLoading &&<div className='text-white text-[10vh] font-bold tracking-tight opacity-90'>
                        Hello {user?.displayName?.split(" ")[0] || "User"},
                    </div>}
                </HoverMoveContainer>
                <HoverMoveContainer
                    sensitivity={0.3}
                    className='w-[40vw]'>
                    {!userLoading && (
                     
                    !tripsLoading? 
                        <HorizontalScrollTripCards trips={trips}/>
                    :
                        <FaSpinner size={"20vh"} className="ml-2 animate-spin text-white my-20" />
                    )}
                </HoverMoveContainer>
            </div>
            <div className='w-[30vw] flex items-center justify-center'>
                <HoverMoveContainer
                        doesTilt
                        sensitivity={1.2}
                        tiltSensitivity={1.2}
                        whileHover={{y: -10, scale: 1.2,}}
                        initial={{opacity: 0, y: -40}}
                        className=''
                        >
                    <JournalCard
                        title={"Write an Entry"}
                        subtitle={t.toLocaleDateString('en-US', {
                            year: 'numeric',    // e.g., "2025"
                            month: 'long',      // e.g., "May"
                            day: 'numeric'      // e.g., "28"
                            })}
                        onClick={() => navigate("/create")}
                    />
                </HoverMoveContainer>
            </div>
        </div>
    </div>
  )
}

export default DashboardScreen