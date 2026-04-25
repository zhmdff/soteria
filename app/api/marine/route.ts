import { getMarineData } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getMarineData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch marine data" }, { status: 500 });
  }
}
