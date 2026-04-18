"use client"

import { Departure } from "@/lib/entur/types";
import { useEffect, useState } from "react"

export default function DepartureBoard({ stopId }: { stopId: string }) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(
          `/api/stops/${encodeURIComponent(stopId)}/departures?limit=10`
        );
        const data = await res.json();

        if (!cancelled) {
          setDepartures(data.departures ?? []);
        }
      } catch (error) {
        console.error(error);

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [stopId]);

  if (loading) return <p>Loading…</p>;
  if (!departures.length) return <p>No departures found.</p>;

  return (
    <div>
      <ul>
        {departures.map((dep) => (
          <li key={dep.id}>
            <div>
              <div>
                {dep.quayPublicCode ? `Platform ${dep.quayPublicCode}` : ""}
              </div>
              <div>
                {dep.linePublicCode ?? "-"} {dep.destination}
              </div>
            </div>

            <div>
              <div>{formatDepartureTime(dep.expectedDepartureTime ?? dep.aimedDepartureTime)}</div>
              {dep.cancelled && (
                <div>Cancelled</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDepartureTime(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}