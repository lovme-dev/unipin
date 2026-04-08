import { useState, useEffect } from "react";

interface GeoData {
  countryCode: string;
  countryName: string;
  languageCode: string;
  flagUrl: string;
}

const LANGUAGE_MAP: Record<string, string> = {
  ID: "ID", US: "EN", GB: "EN", AU: "EN", IN: "EN",
  SA: "AR", AE: "AR", EG: "AR",
  BR: "PT", PT: "PT",
  DE: "DE", AT: "DE",
  FR: "FR", BE: "FR",
  ES: "ES", MX: "ES", AR: "ES",
  JP: "JA", CN: "ZH", KR: "KO", TH: "TH", VN: "VI",
  TR: "TR", RU: "RU", IT: "IT", NL: "NL", PL: "PL",
  MY: "MS", PH: "EN", SG: "EN", TW: "ZH",
};

export function useGeo(): GeoData {
  const [geo, setGeo] = useState<GeoData>({
    countryCode: "ID",
    countryName: "Indonesia",
    languageCode: "ID",
    flagUrl: "",
  });

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const cc = data.country_code || "ID";
        setGeo({
          countryCode: cc,
          countryName: data.country_name || "Indonesia",
          languageCode: LANGUAGE_MAP[cc] || "EN",
          flagUrl: `https://flagcdn.com/w40/${cc.toLowerCase()}.png`,
        });
      })
      .catch(() => {
        setGeo((prev) => ({
          ...prev,
          flagUrl: `https://flagcdn.com/w40/id.png`,
        }));
      });
  }, []);

  return geo;
}
