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
    const ucPackages = [
      { name: "60 UC", price: "0.99" },
      { name: "325 UC", price: "4.99" },
      { name: "660 UC", price: "9.99" },
      { name: "1800 UC", price: "24.99" },
      { name: "3850 UC", price: "49.99" },
      { name: "8100 UC", price: "99.99" },
    ];
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "UniPin PUBG Mobile UC Top Up",
      "brand": { "@type": "Brand", "name": "UniPin" },
      "description": "Buy PUBG Mobile UC at cheapest prices on UniPin. Instant top up, secure payment, official UC reseller worldwide.",
      "category": "Game Currency",
      "image": "https://unipin.pk/og-image.jpg",
      "sku": "UNIPIN-PUBG-UC",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": country.currency,
        "lowPrice": "0.99",
        "highPrice": "99.99",
        "offerCount": ucPackages.length,
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "UniPin" },
        "offers": ucPackages.map(p => ({
          "@type": "Offer",
          "name": `UniPin PUBG Mobile ${p.name}`,
          "price": p.price,
          "priceCurrency": country.currency,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": { "@type": "Organization", "name": "UniPin" }
        }))
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "12500"
      }
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [country.currency]);

  return (
    <>
      <SEOHead
        title="UniPin PUBG UC – Buy Cheap PUBG Mobile UC Online | Instant Top Up"
        description="UniPin PUBG UC top up at cheapest prices. Buy PUBG Mobile UC instantly with secure payment. Official UC reseller for PUBG Mobile players worldwide. Cheap UC, fast delivery."
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
