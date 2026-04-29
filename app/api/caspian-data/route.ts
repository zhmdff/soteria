import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const levelsPath = path.join(process.cwd(), "data", "caspian_sea_levels.json");
    const volumePath = path.join(process.cwd(), "data", "caspian_volume_variations.json");
    
    const levelsData = JSON.parse(await fs.readFile(levelsPath, "utf-8"));
    const volumeData = JSON.parse(await fs.readFile(volumePath, "utf-8"));

    return NextResponse.json({
      levels: levelsData,
      volume: volumeData
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read caspian data" }, { status: 500 });
  }
}
