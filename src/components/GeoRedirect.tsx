import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COUNTRY_DATA, DEFAULT_COUNTRY } from "@/data/countries";

/**
 * GeoRedirect: detects user's country via IP and redirects to /unipin/:cc
 */
export default function GeoRedirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const cc = (data.country_code || DEFAULT_COUNTRY).toUpperCase();
        const target = COUNTRY_DATA[cc] ? cc : DEFAULT_COUNTRY;
        navigate(`/unipin/${target.toLowerCase()}`, { replace: true });
      })
      .catch(() => {
        navigate(`/unipin/${DEFAULT_COUNTRY.toLowerCase()}`, { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return null;
}
