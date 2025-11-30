import PhotoGallery from "@/components/PhotoGallery";

export default function Home() {
  return (
    <main className="min-h-screen py-10 md:py-20 px-4">
      <div className="max-w-[1100px] mx-auto mb-16 text-center">
        <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-white/80 uppercase mb-2">
          Collage
        </h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">
          A collection of moments
        </p>
      </div>

      <PhotoGallery />

      <footer className="mt-20 text-center text-white/20 text-xs tracking-widest uppercase pb-10">
        &copy; {new Date().getFullYear()} Photography
      </footer>
    </main>
  );
}
