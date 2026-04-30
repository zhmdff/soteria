import { searchCities } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "City name is required" }, { status: 400 });
    }

    const data = await searchCities(name);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to search cities" }, { status: 500 });
  }
}
