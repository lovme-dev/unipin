---
name: Country-specific routes and SEO
description: /unipin/:cc routes for 50+ countries with geo-redirect, real-time currency conversion, unique titles/descriptions
type: feature
---
- Routes: /unipin/:countryCode for all countries in RegionSelector
- Geo-redirect: / detects IP via ipapi.co → redirects to /unipin/{cc}
- Currency: Real-time conversion from IDR via exchangerate-api.com, cached 30min
- SEO: Unique title (UniPin first word) and description per country
- Country data: src/data/countries.ts
- Components: CountryPage.tsx, GeoRedirect.tsx, SEOHead.tsx
- Default country: PK (Pakistan)
