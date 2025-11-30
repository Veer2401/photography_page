"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Photo = {
    id: string;
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

// Example photos - in a real app these could come from props or an API
const INITIAL_PHOTOS: Photo[] = [
    { id: "1", src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&h=900&auto=format&fit=crop", alt: "Camera film" }, // Portrait
    { id: "2", src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=900&h=600&auto=format&fit=crop", alt: "Mountain landscape" }, // Landscape
    { id: "3", src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=800&h=800&auto=format&fit=crop", alt: "Abstract architecture" }, // Square
    { id: "4", src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&h=1000&auto=format&fit=crop", alt: "Dark portrait" }, // Tall
    { id: "5", src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=900&h=500&auto=format&fit=crop", alt: "Neon city" }, // Wide
    { id: "6", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=700&h=900&auto=format&fit=crop", alt: "Portrait" }, // Portrait
    { id: "7", src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&h=600&auto=format&fit=crop", alt: "Waterfall" }, // Landscape
    { id: "8", src: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=600&h=800&auto=format&fit=crop", alt: "Profile" }, // Portrait
    { id: "9", src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&h=1200&auto=format&fit=crop", alt: "Foggy forest" }, // Tall
    { id: "10", src: "https://images.unsplash.com/photo-1501854140884-074cf2b21d25?q=80&w=900&h=600&auto=format&fit=crop", alt: "Lake" }, // Landscape
    { id: "11", src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&h=600&auto=format&fit=crop", alt: "Fashion" }, // Square
    { id: "12", src: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=1000&h=500&auto=format&fit=crop", alt: "Space" }, // Wide
];

export default function PhotoGallery() {
    const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    // Load more photos on scroll (simulated)
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 500
            ) {
                // Append more photos to simulate infinite scroll
                setPhotos((prev) => [
                    ...prev,
                    ...INITIAL_PHOTOS.map((p) => ({ ...p, id: crypto.randomUUID() })),
                ]);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openLightbox = (index: number) => {
        setSelectedPhotoIndex(index);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setSelectedPhotoIndex(null);
        document.body.style.overflow = "auto";
    };

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((prev) =>
                prev === null || prev === photos.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((prev) =>
                prev === null || prev === 0 ? photos.length - 1 : prev - 1
            );
        }
    };

    return (
        <>
            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 p-4 max-w-[1100px] mx-auto">
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="break-inside-avoid mb-4 overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(index)}
                    >
                        <motion.img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                            whileHover={{ scale: 1.03 }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedPhotoIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
                            onClick={closeLightbox}
                        >
                            <X size={32} />
                        </button>

                        <button
                            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-4"
                            onClick={prevPhoto}
                        >
                            <ChevronLeft size={40} />
                        </button>

                        <motion.img
                            key={photos[selectedPhotoIndex].id}
                            src={photos[selectedPhotoIndex].src}
                            alt={photos[selectedPhotoIndex].alt}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <button
                            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-4"
                            onClick={nextPhoto}
                        >
                            <ChevronRight size={40} />
                        </button>

                        <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-sm font-light tracking-widest">
                            {selectedPhotoIndex + 1} / {photos.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
