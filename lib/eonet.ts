// NASA EONET (Earth Observatory Natural Event Tracker) API V3
// Documentation: https://eonet.gsfc.nasa.gov/docs/v3

const EONET_BASE_URL = "https://eonet.gsfc.nasa.gov/api/v3";

export interface EONETEvent {
  id: string;
  title: string;
  description: string;
  link: string;
  categories: { id: string; title: string }[];
  sources: { id: string; url: string }[];
  geometry: { date: string; type: string; coordinates: [number, number] }[];
}

export async function getNaturalEvents(days: number = 30) {
  try {
    // Fetching events from the last X days
    // We can also filter by category or bbox if needed
    const url = `${EONET_BASE_URL}/events?days=${days}&status=open`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.events as EONETEvent[];
  } catch (error) {
    console.error("EONET Fetch Error:", error);
    return [];
  }
}
