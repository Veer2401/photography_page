import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const photosDir = path.join(process.cwd(), "public", "photos");

  try {
    // Check if directory exists
    if (!fs.existsSync(photosDir)) {
      return NextResponse.json({ photos: [] });
    }

    // Read all files from the photos directory
    const files = fs.readdirSync(photosDir);

    // Filter for supported image formats and get file stats
    const supportedFormats = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
    const photosWithStats = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return supportedFormats.includes(ext);
      })
      .map((file) => {
        const filePath = path.join(photosDir, file);
        const stats = fs.statSync(filePath);
        return {
          file,
          birthtime: stats.birthtime.getTime(), // When file was created/added
        };
      });

    // Sort by creation time: oldest first (first added at top)
    photosWithStats.sort((a, b) => a.birthtime - b.birthtime);

    const photos = photosWithStats.map((item, index) => ({
      src: `/photos/${item.file}`,
      alt: `Photo ${index + 1}`,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error reading photos directory:", error);
    return NextResponse.json({ photos: [] });
  }
}
