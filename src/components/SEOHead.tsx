import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  countryCode: string;
  countryName: string;
  canonicalPath: string;
}

export default function SEOHead({ title, description, countryCode, countryName, canonicalPath }: SEOHeadProps) {
  useEffect(() => {
    // Enforce <60 char title for SEO best practice
    const safeTitle = title.length > 60 ? title.slice(0, 57).trimEnd() + "…" : title;
    document.title = safeTitle;

    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("og:title", safeTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", `https://www.unipin.pk${canonicalPath}`, true);
    setMeta("twitter:title", safeTitle);
    setMeta("twitter:description", description);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://www.unipin.pk${canonicalPath}`;

    // Update JSON-LD
    let jsonLd = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (jsonLd) {
      jsonLd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPin Official",
        "alternateName": "UniPin",
        "description": description,
        "url": `https://www.unipin.pk${canonicalPath}`,
        "applicationCategory": "GameApplication",
        "operatingSystem": "Web",
        "areaServed": {
          "@type": "Country",
          "name": countryName
        }
      });
    }
  }, [title, description, countryCode, countryName, canonicalPath]);

  return null;
}
