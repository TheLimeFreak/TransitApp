import type { Departure } from "./types";

const ET_CLIENT_NAME = process.env.ET_CLIENT_NAME!;

const DEPARTURES_QUERY = `
  query Departures($stopId: String!, $numberOfDepartures: Int!) {
    stopPlace(id: $stopId) {
      id
      name
      estimatedCalls(numberOfDepartures: $numberOfDepartures) {
        realtime
        aimedDepartureTime
        expectedDepartureTime
        cancellation
        destinationDisplay {
          frontText
        }
        quay {
          publicCode
        }
        serviceJourney {
          id
          transportMode
          line {
            id
            publicCode
          }
        }
      }
    }
  }
`;

export async function getDeparturesForStop(stopId:string, numberOfDepartures = 10, ): Promise<Departure[]> {
  
  const res = await fetch("https://api.entur.io/journey-planner/v3/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ET-Client-Name": ET_CLIENT_NAME,
    },
    body: JSON.stringify({
      query: DEPARTURES_QUERY,
      variables: {
        stopId,
        numberOfDepartures,
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Entur Journey Planner failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }

  const calls = json.data?.stopPlace?.estimatedCalls ?? [];

  return calls.map((call: any): Departure => ({
    id: call.serviceJourny?.id,
    destination: call.destinationDisplay?.frontText,
    aimedDepartureTime:call.aimedDepartureTime,
    expectedDepartureTime:call.expectedDepartureTime,
    lineId:call.serviceJourney?.line?.id,
    linePublicCode:call.serviceJourney?.line?.publicCode,
    transportMode:call.serviceJourney?.transportMode,
    quayPublicCode:call.quay?.publicCode,
    realtime:Boolean(call.realtime),
    cancelled:Boolean(call.cancellation),
  }));
}