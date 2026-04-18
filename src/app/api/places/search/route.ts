import type { PlaceSearchResult } from "@/lib/entur/types";
import { NextRequest, NextResponse } from "next/server";

const ET_CLIENT_NAME = process.env.ET_CLIENT_NAME!;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://api.entur.io/geocoder/v1/autocomplete");
  url.searchParams.set("text", q);
  url.searchParams.set("lang", "no");
  url.searchParams.set("size", "8");
  url.searchParams.set("multiModal", "parent");

  if (lat && lon) {
    url.searchParams.set("focus.point.lat", lat);
    url.searchParams.set("focus.point.lon", lon);
  }

  const res = await fetch(url.toString(), {
    headers: {
      "ET-Client-Name": ET_CLIENT_NAME,
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      {error: `Entur geocoder failes: ${res.status}`},
      {status: 502}
    );
  }

  const json = await res.json();

  const results: PlaceSearchResult[] = (json.features ?? []).map((feature: any) => ({
    id: feature.properties?.id,
    name: feature.properties?.name,
    label: feature.properties?.label,
    category: feature.properties?.category,
    layer: feature.properties?.layer,
    lat: feature.geometry?.coordinates?.[1],
    lon: feature.geometry?.coordinates?.[0],
  }));

  return NextResponse.json({results});
}