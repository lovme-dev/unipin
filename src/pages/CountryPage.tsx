import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCountryData, COUNTRY_DATA, DEFAULT_COUNTRY } from "@/data/countries";
import SEOHead from "@/components/SEOHead";
import Index from "./Index";

const CountryPage = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  const cc = countryCode?.toUpperCase() || DEFAULT_COUNTRY;

  useEffect(() => {
    if (!COUNTRY_DATA[cc]) {
      navigate(`/unipin/${DEFAULT_COUNTRY.toLowerCase()}`, { replace: true });
    }
  }, [cc, navigate]);

  if (!COUNTRY_DATA[cc]) return null;

  const country = getCountryData(cc);

  return (
    <>
      <SEOHead
        title={country.title}
        description={country.description}
        countryCode={country.code}
        countryName={country.name}
        canonicalPath={`/unipin/${cc.toLowerCase()}`}
      />
      <Index countryOverride={{ code: cc, name: country.name, currency: country.currency, currencySymbol: country.currencySymbol }} />
    </>
  );
};

export default CountryPage;
