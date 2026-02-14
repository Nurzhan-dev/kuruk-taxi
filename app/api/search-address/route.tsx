import { NextResponse } from "next/server";

// Используем Nominatim API (OpenStreetMap)
const BASE_URL = "https://nominatim.openstreetmap.org/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchText = searchParams.get("q");

  if (!searchText) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `${BASE_URL}?q=${searchText}&format=json&addressdetails=1&limit=8&countrycodes=kz`, 
      {
        headers: {
          "User-Agent": "KurykDrive/1.0", // Важно! OSM требует User-Agent
        },
      }
    );

    const data = await res.json();

    // Преобразуем формат OSM в удобный для нас вид
    const suggestions = data.map((item: any) => ({
      full_address: item.display_name,
      lat: item.lat,
      lon: item.lon,
      name: item.name || item.display_name.split(',')[0]
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}