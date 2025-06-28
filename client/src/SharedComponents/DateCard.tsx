import React from 'react'
import InlineTextAreaInput from './InlineTextAreaInput'
import ImageUploader from './ImageUploader';
import type { Trip, UploadedImage } from '../types';
import { editTrip } from '../Api/tripApi';
import { useParams } from 'react-router-dom';
import ImageGallery from './ImageGallery';

interface DateCardProps {
    date: Date
    trip: Trip
    setTrip: (trip: Trip) => void
    setModalImage: (idx: number) => void
}

const DateCard : React.FC<DateCardProps> = ({date, trip, setTrip, setModalImage}) => {
    const { id } = useParams()

    const dateKey = date.toISOString().split("T")[0]

    const description = trip.dateDescriptions?.get(dateKey) || ""

    async function addDescriptionToDate(
        description: string
    ): Promise<void> {
        const tempMap = trip?.dateDescriptions|| new Map();

        if(!tempMap?.has(dateKey)) {
            tempMap?.set(dateKey, []);
        }

        tempMap?.set(dateKey, description);
        if(!id) return
        editTrip(id,{dateDescriptions: Object.fromEntries(tempMap)})

    }

    async function addImageToDate(
            newImages: UploadedImage[]
        ): Promise<void> {
            const tempMap = trip?.dateImages || new Map();
    
            if(!tempMap?.has(dateKey)) {
                tempMap?.set(dateKey, []);
            }
    
            tempMap?.get(dateKey)!.push(...newImages);
            if(!id) return

            const res = await editTrip(id,{dateImages: Object.fromEntries(tempMap)})
            setTrip({...trip, dateImages: new Map<string, UploadedImage[]>(Object.entries(res.dateImages))})
      }

    const DescriptionArea = React.memo(({description} : {description : string}) => {
        return (
            <InlineTextAreaInput
            placeholder='Description'
            value={description|| ""}
            onSave={async (value) => addDescriptionToDate(value)}
            className="        
            w-full    
            max-h-[40vh]             
            text-white
            text-xl 
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
        )
    })

  return (
    <>
        <div className='text-white text-5xl font-bold tracking-tight opacity-100'> 
            {date.toLocaleDateString()}
        </div>
        <div>
        <DescriptionArea description={description}/>
        </div>
        <div className='text-white text-3xl tracking-tight opacity-100 '>
            Images
        </div>
        <ImageGallery images={trip.dateImages?.get(dateKey) || []} setModalImage={setModalImage}/>
        <ImageUploader addImages={(newImages: UploadedImage[]) => addImageToDate(newImages)}/>
    </>
  )
}

export default React.memo(DateCard)