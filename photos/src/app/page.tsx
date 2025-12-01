
import PhotoGallery from "@/components/PhotoGallery";
import { Montserrat, Cormorant_Garamond } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["700"],
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Main container - centered with max-width */}
      <div className="mx-auto max-w-[1000px] px-4 pt-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="flex flex-col sm:flex-row items-center justify-between mb-24 gap-12 min-h-[340px] sm:min-h-[420px]">
          {/* Profile Photo Circle (Left) */}
          <div className="flex-1 flex justify-start w-full">
            <div className="w-64 h-64 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl relative">
              {/* Upload your profile photo below by replacing src */}
              {/* <Image src="/profile.jpg" alt="Profile" width={256} height={256} className="object-cover w-full h-full rounded-full" /> */}
            </div>
          </div>
          {/* Title and Description (Right) */}
          <div className="flex-1 w-full text-left flex flex-col justify-center items-start">
            <span className={`uppercase tracking-[0.3em] text-zinc-400 text-sm mb-2 ${cormorant.className}`}></span>
            <h1 className={`text-7xl font-normal text-zinc-100 tracking-tight mb-8 whitespace-nowrap ${montserrat.className}`}>Lost Frameworks</h1>
            <p className="text-zinc-400 text-2xl max-w-md leading-relaxed">
              Welcome! Here, time stands still and every image tells a story of its own. Browse through my gallery, share what resonates with you, and journey with me through the art of captured moments.
            </p>
          </div>
        </section>
        <PhotoGallery />
      </div>
    </main>
  );
}
