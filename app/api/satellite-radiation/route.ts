import { NextResponse } from "next/server";
import { getSatelliteRadiation } from "@/lib/openmeteo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "40.4093");
  const lon = parseFloat(searchParams.get("lon") || "49.8671");

  try {
    const data = await getSatelliteRadiation(lat, lon);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch radiation data" }, { status: 500 });
  }
}
