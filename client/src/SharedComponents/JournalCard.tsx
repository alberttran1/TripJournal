import React from 'react'

interface JournalCardProps {
    title : string,
    subtitle : string,
    onClick : () => void,
}

const JournalCard : React.FC<JournalCardProps> = ({title, subtitle, onClick}) => {
  return (
    <>
        <svg
        viewBox="20 0 60 410"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[5vw] h-[25vw] min-w-[5rem] min-h-[25rem] absolute left-0 z-2 -translate-x-[50%]"
        >
            <path
                d="
                M50,10 
                C10,20 70,40 50,60
                C10,80 70,100 50,120
                C10,140 70,160 50,180
                C10,200 70,220 50,240
                C10,260 70,280 50,300
                C10,320 70,340 50,360
                C10,380 70,420 50,370

                "
                stroke="purple"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
                animation: "drawSpring 4.5s ease-out forwards",
                }}
            />
            <style>
                {`
                @keyframes drawSpring {
                    to {
                    stroke-dashoffset: 0;
                    }
                }
                `}
            </style>
        </svg>
        <div
            className="
                        w-[20vw] h-[25vw] min-w-[20rem] min-h-[25rem] bg-gradient-to-br from-blue-400 to-purple-400
                        rounded-xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transition-colors 
                        left-0 top-0 z-1 relative
                    "
            onClick={onClick}
            >
            <div className="h-full flex flex-col justify-between">
                <h2 className="text-[2vh] font-bold text-gray-900">{title}</h2>
                <p className="text-gray-200 text-sm mt-4">
                {subtitle}
                </p>
                <div className="mt-auto text-right text-sm text-black italic group-hover:text-gray-100">
                Start Writing →
                </div>
            </div>
        </div>
    </>
  )
}

export default JournalCard