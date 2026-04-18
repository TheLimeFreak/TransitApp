import { getDeparturesForStop } from "@/lib/entur/journey-planner";
import type { Departure } from "@/lib/entur/types";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{stopId: string}>;
}

export async function GET(req: NextRequest, {params}: Params) {
  const { stopId } = await params;
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10");

  try {
    const departures = await getDeparturesForStop(stopId, limit);
    return NextResponse.json<{departures: Departure []}>({departures});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: "Failed to fetch departures"},
      {status: 502}
    );
  }
  
}