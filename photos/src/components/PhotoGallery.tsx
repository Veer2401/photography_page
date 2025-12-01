"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PhotoGallery({ images: propImages }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [displayPhotos, setDisplayPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch photos from the API on mount
  useEffect(() => {
    if (propImages) {
      setPhotos(propImages);
      setDisplayPhotos(shuffleArray(propImages));
      setLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos");
        const data = await response.json();
        setPhotos(data.photos);
        setDisplayPhotos(shuffleArray(data.photos));
      } catch (error) {
        console.error("Error fetching photos:", error);
        setPhotos([]);
        setDisplayPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [propImages]);

  // Shuffle photos every 5 minutes
  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      setDisplayPhotos(shuffleArray(photos));
      setLoadedImages(new Set()); // Reset loaded state for fade-in effect
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, [photos]);

  const images = displayPhotos;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-zinc-500">Loading photos...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-zinc-500">No photos yet. Add images to /public/photos folder.</div>
      </div>
    );
  }

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
