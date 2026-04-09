import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";

interface Region {
  name: string;
  countries: { code: string; name: string }[];
}

const REGIONS: Region[] = [
  {
    name: "Southeast Asia",
    countries: [
      { code: "BN", name: "Brunei" },
      { code: "KH", name: "Cambodia" },
      { code: "ID", name: "Indonesia" },
      { code: "LA", name: "Laos" },
      { code: "MY", name: "Malaysia" },
      { code: "MM", name: "Myanmar" },
      { code: "PH", name: "Philippines" },
      { code: "TH", name: "Thailand" },
    ],
  },
  {
    name: "North America",
    countries: [
      { code: "CA", name: "Canada" },
      { code: "US", name: "United States" },
    ],
  },
  {
    name: "Latin America",
    countries: [
      { code: "AR", name: "Argentina" },
      { code: "BR", name: "Brazil" },
      { code: "CO", name: "Colombia" },
      { code: "MX", name: "Mexico" },
    ],
  },
  {
    name: "Middle East and Africa",
    countries: [
      { code: "DZ", name: "Algeria" },
      { code: "BH", name: "Bahrain" },
      { code: "EG", name: "Egypt" },
      { code: "KW", name: "Kuwait" },
      { code: "MA", name: "Morocco" },
      { code: "NG", name: "Nigeria" },
      { code: "OM", name: "Oman" },
      { code: "QA", name: "Qatar" },
      { code: "SA", name: "Saudi Arabia" },
      { code: "ZA", name: "South Africa" },
      { code: "TR", name: "Turkey" },
      { code: "AE", name: "United Arab Emirates" },
    ],
  },
  {
    name: "Asia",
    countries: [
      { code: "BD", name: "Bangladesh" },
      { code: "HK", name: "Hong Kong" },
      { code: "IN", name: "India" },
      { code: "JP", name: "Japan" },
      { code: "MN", name: "Mongolia" },
      { code: "PK", name: "Pakistan" },
      { code: "KR", name: "South Korea" },
      { code: "LK", name: "Sri Lanka" },
      { code: "TW", name: "Taiwan" },
    ],
  },
  {
    name: "Europe",
    countries: [
      { code: "AT", name: "Austria" },
      { code: "BE", name: "Belgium" },
      { code: "BG", name: "Bulgaria" },
      { code: "HR", name: "Croatia" },
      { code: "CY", name: "Cyprus" },
      { code: "CZ", name: "Czech Republic" },
      { code: "DK", name: "Denmark" },
      { code: "EE", name: "Estonia" },
      { code: "FI", name: "Finland" },
      { code: "FR", name: "France" },
      { code: "DE", name: "Germany" },
      { code: "GR", name: "Greece" },
      { code: "HU", name: "Hungary" },
      { code: "IE", name: "Ireland" },
      { code: "IT", name: "Italy" },
      { code: "LV", name: "Latvia" },
      { code: "LT", name: "Lithuania" },
      { code: "LU", name: "Luxembourg" },
      { code: "MT", name: "Malta" },
      { code: "NL", name: "Netherlands" },
      { code: "PL", name: "Poland" },
      { code: "PT", name: "Portugal" },
      { code: "RO", name: "Romania" },
      { code: "SK", name: "Slovakia" },
      { code: "SI", name: "Slovenia" },
      { code: "ES", name: "Spain" },
      { code: "SE", name: "Sweden" },
      { code: "GB", name: "United Kingdom" },
    ],
  },
  {
    name: "Oceania",
    countries: [
      { code: "AU", name: "Australia" },
    ],
  },
];

const LANGUAGE_MAP: Record<string, string> = {
  ID: "ID", US: "EN", GB: "EN", AU: "EN", IN: "EN", CA: "EN", NG: "EN", PH: "EN", SG: "EN", HK: "EN", ZA: "EN", IE: "EN", MT: "EN", CY: "EN", PK: "UR", BD: "EN", LK: "EN", MM: "EN", BN: "EN", KH: "EN", LA: "EN", MN: "EN",
  SA: "AR", AE: "AR", EG: "AR", BH: "AR", KW: "AR", OM: "AR", QA: "AR", DZ: "AR", MA: "AR",
  BR: "PT", PT: "PT",
  DE: "DE", AT: "DE", LU: "DE",
  FR: "FR", BE: "FR",
  ES: "ES", MX: "ES", AR: "ES", CO: "ES",
  JP: "JA", CN: "ZH", TW: "ZH",
  KR: "KO", TH: "TH", VN: "VI", TR: "TR", RU: "RU", IT: "IT", NL: "NL", PL: "PL", MY: "MS",
  SE: "SV", DK: "DA", FI: "FI", NO: "NO", CZ: "CS", SK: "SK", HU: "HU", RO: "RO", BG: "BG", HR: "HR", SI: "SL", EE: "ET", LV: "LV", LT: "LT", GR: "EL",
};

export function getLanguageCode(countryCode: string): string {
  return LANGUAGE_MAP[countryCode] || "EN";
}

interface RegionSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCountry: string;
  selectedLang: "local" | "en";
  onSelectCountry: (code: string, name: string) => void;
  onSelectLang: (lang: "local" | "en") => void;
  localLangCode: string;
}

export default function RegionSelector({
  open,
  onOpenChange,
  selectedCountry,
  selectedLang,
  onSelectCountry,
  onSelectLang,
  localLangCode,
}: RegionSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[95vw] max-h-[85vh] overflow-y-auto bg-[hsl(220,25%,14%)] border-[hsl(220,20%,22%)] p-0">
        <div className="sticky top-0 z-10 bg-[hsl(220,25%,14%)] p-5 pb-0">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => onOpenChange(false)}>
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <DialogTitle className="text-xl font-bold text-foreground">Available regions</DialogTitle>
          </div>

          <div className="mb-4">
            <h3 className="text-base font-bold text-foreground mb-3">Language</h3>
            <div className="flex gap-3">
              <button
                onClick={() => onSelectLang("local")}
                className={`px-8 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  selectedLang === "local"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground border-primary/60"
                }`}
              >
                {localLangCode}
              </button>
              <button
                onClick={() => onSelectLang("en")}
                className={`px-8 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  selectedLang === "en"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground border-primary/60"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="border-t border-[hsl(220,20%,25%)]" />
        </div>

        <div className="p-5 pt-3">
          <h3 className="text-lg font-bold text-foreground mb-4">Select your location</h3>

          {REGIONS.map((region) => (
            <div key={region.name} className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">{region.name}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {region.countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      onSelectCountry(country.code, country.name);
                      onOpenChange(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      selectedCountry === country.code
                        ? "bg-primary/20 border-primary"
                        : "bg-[hsl(220,20%,18%)] border-[hsl(220,20%,25%)] hover:border-primary/40"
                    }`}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                      alt={country.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-sm text-foreground">{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
