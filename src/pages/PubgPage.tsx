import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import Index from "./Index";
import pubgLogo from "@/assets/pubg-logo.webp";
import ucChest from "@/assets/uc-chest.jpeg";
import { useGeo } from "@/hooks/use-geo";
import { getCountryData } from "@/data/countries";

const PubgPage = () => {
  const geo = useGeo();
  const country = getCountryData(geo.countryCode);

  useEffect(() => {
    // JSON-LD specific to PUBG
    const existing = document.getElementById("pubg-jsonld");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "pubg-jsonld";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "PUBG Mobile UC Top Up",
      "brand": { "@type": "Brand", "name": "Midasbuy" },
      "description": "Buy PUBG Mobile UC at the cheapest prices. Instant top up, secure payment, official distributor.",
      "category": "Game Currency",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": country.currency,
        "lowPrice": "1",
        "availability": "https://schema.org/InStock"
      }
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [country.currency]);

  return (
    <>
      <SEOHead
        title="MIDASBUY PUBG UC – Buy Cheap PUBG Mobile UC Online | Instant Top Up"
        description="Midasbuy PUBG UC top up at cheapest prices. Buy PUBG Mobile UC instantly with secure payment. Official UC reseller for PUBG Mobile players worldwide. Cheap UC, fast delivery."
        countryCode={country.code}
        countryName={country.name}
        canonicalPath="/pubg"
      />
      <Index
        gameConfig={{
          name: "PUBG Mobile",
          publisher: "Tencent",
          icon: pubgLogo,
          currencyLabel: "UC",
          packageImage: ucChest,
          itemLabel: "UC",
        }}
      />
    </>
  );
};

export default PubgPage;
