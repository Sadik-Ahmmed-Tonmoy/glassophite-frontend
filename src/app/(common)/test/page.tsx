/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function RegionDetector() {
  const [region, setRegion] = useState<string | null>(null);
  const [allInfo, setAllInfo] = useState<any | null>(null);
  const [continent, setContinent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // 🔹 Step 1: Reverse geocode to get country name
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();

          console.log("Geocode data:", geoData);

          const countryName = geoData.address?.country;
          const displayRegion =
            geoData.address?.state ||
            geoData.address?.state_district ||
            geoData.address?.county ||
            geoData.address?.city ||
            countryName;

            setAllInfo(geoData.address )
          setRegion(displayRegion);

          // 🔹 Step 2: Fetch continent using restcountries API
          if (countryName) {
            const countryRes = await fetch(
              `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
            );

            if (!countryRes.ok) throw new Error("Failed to fetch country info");

            const countryData = await countryRes.json();
            const detectedContinent = countryData?.[0]?.region;

            setContinent(detectedContinent || "Unknown");
          } else {
            setContinent("Unknown");
          }
        } catch (err: any) {
          console.error(err);
          setError("Failed to fetch location or continent data.");
        }
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">📍 Your Location</h2>

      {region || continent ? (
        <div className="space-y-1">
          {region && (
            <p>
              <strong>Region:</strong> {region}
            </p>
          )}
          {continent && (
            <p>
              <strong>Continent:</strong> {continent}
            </p>
          )}
          {allInfo && (
            <div className="mt-2 p-2 border rounded bg-gray-50">
              <h3 className="font-semibold mb-1">Full Address Info:</h3>
              <pre className="text-sm">{JSON.stringify(allInfo, null, 2)}</pre>
            </div>
          )}

        </div>
      ) : error ? (
        <p className="text-red-500">❌ {error}</p>
      ) : (
        <p>Detecting location...</p>
      )}
    </div>
  );
}
