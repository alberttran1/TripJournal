import React from "react";
import type { UploadedImage } from "../types";
import MemoImage from "./MemoImage";

interface ImageGalleryProps {
  images: UploadedImage[];
  setModalImage: (idx: number) => void
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, setModalImage }) => {

  return (
    <div>
      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative overflow-visible cursor-pointer"
            onClick={() => setModalImage(i)}
          >
           <MemoImage preview={img.preview}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
