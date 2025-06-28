import React, { useCallback, useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";
import * as exifr from 'exifr';
import type { UploadedImage } from "../types";

interface ImageUploaderProps {
  description?: string,
  loadingDescription?: string,
  addImages: (images: UploadedImage[]) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ description, loadingDescription, addImages }) => {
  const [progress, setProgress] = useState<number>(0);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
  
    const imageFiles = Array.from(files).filter(file =>
      file.type.startsWith("image/")
    );
    const total = imageFiles.length;
  
    setDisabled(true);
    setProgress(0);
    setErrorOccurred(false);
  
    const uploadedImages: UploadedImage[] = [];
    let completed = 0;
  
    await Promise.all(
      imageFiles.map(async (file, index) => {
        let takenAt: Date | null = null;
  
        try {
          const exif = await exifr.parse(file, ['DateTimeOriginal']);
          takenAt = exif?.DateTimeOriginal ?? null;
        } catch (err) {
          console.warn(`EXIF failed for file ${file.name}`, err);
          // Continue even if EXIF fails
        }
  
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  
        try {
          const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });
  
          if (!res.ok) throw new Error(`Upload failed for ${file.name}`);
  
          const data = await res.json();
  
          const newImage: UploadedImage = {
            file,
            preview: data.secure_url,
            takenAt,
          };
  
          uploadedImages.push(newImage);
          addImages([newImage]);
  
        } catch (err) {
          console.error(err);
          setErrorOccurred(true);
        } finally {
          completed++;
          setProgress(Math.round((completed / total) * 100));
        }
      })
    );
  
    setDisabled(false);
    setTimeout(() => setProgress(0), 300);
  }, [addImages]);  
  

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      className={`group/uploader group border-2 border-dashed border-white rounded-lg p-6 text-center transition ${!disabled ? "hover:border-blue-400 cursor-pointer" : ""} flex flex-col items-center gap-4`}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={handleClick}
    >
      <p className={`text-white ${!disabled && "group-hover/uploader:text-blue-400"} transition text-lg`}>{disabled ? (loadingDescription || "Drag and drop images here, or click to upload") : (description || "Drag and drop images here, or click to upload")}</p>
      <div className={`text-white ${!disabled && "group-hover/uploader:text-blue-400"} transition`}>
        <FaImage size={50} />
      </div>
      <input
        disabled={disabled}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      {progress > 0 && (
        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
