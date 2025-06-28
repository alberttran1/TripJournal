// src/components/HoverMoveCard.tsx
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type TargetAndTransition, type VariantLabels } from "framer-motion";

interface HoverMoveContainerProps {
    children: ReactNode;
    whileHover?: VariantLabels | TargetAndTransition | undefined;
    sensitivity?: number;
    doesTilt?: boolean;
    tiltSensitivity?: number;
    initial?: boolean | VariantLabels | TargetAndTransition | undefined;
    className?: string;
  }

const HoverMoveContainer: React.FC<HoverMoveContainerProps> = ({ children, className, whileHover, doesTilt, initial, sensitivity = 1, tiltSensitivity = 1 }) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [tilt, setTilt] = useState({ x: 0, y: 0});
    const [center, setCenter] = useState<{x: number, y: number}>();

    const handleMouseMove = (e: MouseEvent) => {
        if(!center) return;
        const offsetX = ((e.clientX) - center.x) / 10;
        const offsetY = ((e.clientY) - center.y) / 10;
        setOffset({ x: offsetX, y: offsetY });
    };

    const handleRotateAmt = (e: React.MouseEvent) => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (!rect) return;
    
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
    
        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20;

    
        setTilt({ x: rotateX, y: rotateY });
      };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [center]);

    useEffect(() => {
        const updateCenter = () => {
          if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setCenter({
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            });
          }
        };
    
        updateCenter();
        window.addEventListener("resize", updateCenter);
        return () => window.removeEventListener("resize", updateCenter);
      }, []);


    return (
        <div className='group relative w-fit' ref={anchorRef}>
            <motion.div
                initial={initial}
                whileHover={whileHover}
                className={className}
                onMouseMove={handleRotateAmt}
                onMouseLeave={() => setTilt({x:0,y:0})}
                animate={{ 
                    opacity: 1,
                    x: -offset.x * sensitivity, 
                    y: -offset.y * sensitivity, 
                    rotateX: doesTilt ? tilt.x * tiltSensitivity: 0,
                    rotateY: doesTilt ? tilt.y * tiltSensitivity: 0,
                 }}
                transition={{ duration: 2, ease: [0.15, 0.85, 0.25, 1] }}

                >
                {children}
            </motion.div>
        </div>
    );
};

export default HoverMoveContainer;
