import { getHistoricalArchive } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getHistoricalArchive();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch historical archive" }, { status: 500 });
  }
}
