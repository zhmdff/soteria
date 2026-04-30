import { getSatelliteRadiation } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    const data = await getSatelliteRadiation(
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch satellite radiation data" }, { status: 500 });
  }
}
