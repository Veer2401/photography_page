"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// Example photo array - add your photos here
// Supports both .png and .jpg/.jpeg formats
// Photos should be placed in /public/photos folder
export const photos = [
  // Add your photos like this:
  // { src: "/photos/photo1.jpg", alt: "Photo 1" },
  // { src: "/photos/photo2.png", alt: "Photo 2" },
  // { src: "/photos/photo3.jpeg", alt: "Photo 3" },
  
  // Placeholder boxes (replace with your actual photos)
  { src: "", alt: "Photo 1", placeholder: true },
  { src: "", alt: "Photo 2", placeholder: true },
  { src: "", alt: "Photo 3", placeholder: true },
  { src: "", alt: "Photo 4", placeholder: true },
  { src: "", alt: "Photo 5", placeholder: true },
  { src: "", alt: "Photo 6", placeholder: true },
  { src: "", alt: "Photo 7", placeholder: true },
  { src: "", alt: "Photo 8", placeholder: true },
  { src: "", alt: "Photo 9", placeholder: true },
  { src: "", alt: "Photo 10", placeholder: true },
  { src: "", alt: "Photo 11", placeholder: true },
  { src: "", alt: "Photo 12", placeholder: true },
];

interface Photo {
  src: string;
  alt: string;
  placeholder?: boolean;
}

interface PhotoGalleryProps {
  images?: Photo[];
}

// Random heights for uneven masonry look
const placeholderHeights = [280, 350, 220, 400, 300, 260, 380, 320, 240, 360, 290, 340];

export default function PhotoGallery({ images = photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const openLightbox = (index: number) => {
    // Only open lightbox for actual images, not placeholders
    const photo = images[index];
    if (photo.placeholder) return;
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  }, [selectedIndex, images.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  }, [selectedIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  return (
    <>
      {/* Masonry Gallery */}
      <div className="gallery-masonry">
        {images.map((photo, index) => (
          <div
            key={index}
            className="gallery-item group"
            onClick={() => openLightbox(index)}
          >
            {photo.placeholder ? (
              // Blank placeholder box
              <div
                className="w-full bg-zinc-900/50 rounded-sm"
                style={{ height: placeholderHeights[index % placeholderHeights.length] }}
              />
            ) : (
              <div
                className={`relative overflow-hidden transition-opacity duration-700 ${
                  loadedImages.has(index) ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="gallery-image w-full h-auto"
                  onLoad={() => handleImageLoad(index)}
                  unoptimized={photo.src.startsWith("http")}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous button */}
          <button
            className="absolute left-4 z-50 p-3 text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image container */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              width={1200}
              height={1600}
              className="max-h-[90vh] w-auto object-contain"
              unoptimized={images[selectedIndex].src.startsWith("http")}
              priority
            />
          </div>

          {/* Next button */}
          <button
            className="absolute right-4 z-50 p-3 text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-light tracking-widest">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
