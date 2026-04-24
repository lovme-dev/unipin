import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import MobileMenu from "@/components/MobileMenu";
import RegionSelector from "@/components/RegionSelector";
import { useGeo } from "@/hooks/use-geo";
import { getCountryData } from "@/data/countries";
import { getTranslations } from "@/i18n/translations";
import { useState } from "react";
import { Menu } from "lucide-react";
import unipinLogo from "@/assets/unipin-logo.svg";
import careersImg from "@/assets/careers-hire-me.png";

const CareersPage = () => {
  const navigate = useNavigate();
  const geo = useGeo();
  const country = getCountryData(geo.countryCode);
  const t = getTranslations("EN");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title={`Careers at UniPin ${country.name} – Join Our Team | Game Top Up Jobs`}
        description={`Join UniPin ${country.name} — discover careers in game top-up, payments and esports. Explore current job openings at UniPin.`}
        countryCode={country.code}
        countryName={country.name}
        canonicalPath="/careers"
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Top bar */}
        <div className="sticky top-0 z-40">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--header-glow) / 0.67) 0%, hsl(var(--header-glow) / 0.32) 45%, transparent 100%)",
            }}
          />
          <div className="relative z-20 py-1.5 px-3 flex items-center justify-between">
            <span className="font-bold tracking-wide text-[10px]">
              INSTANT TOP UP! INSTANT PLAY!
            </span>
            <RegionSelector />
          </div>
          <div className="relative z-10 px-3 py-2 flex items-center justify-between">
            <button onClick={() => setMenuOpen(true)} aria-label="Menu">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/">
              <img src={unipinLogo} alt="UniPin" className="h-6" />
            </Link>
            <div className="w-6" />
          </div>
        </div>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} t={t} />

        <main className="px-4 py-6 max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/40 mb-6"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <img
              src={careersImg}
              alt="UniPin careers — Hire Me"
              className="w-full max-w-[320px] h-auto mb-8"
              loading="lazy"
            />

            <p className="text-primary font-bold tracking-widest text-sm mb-3">
              CAREERS
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Discover Your Dream Job!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              Join our mission in becoming the premier top-up platform in the
              world! We are currently expanding to over 35+ countries and are
              looking for talented people to join us in the following positions.
            </p>

            <p className="font-semibold text-foreground">
              No Job Available on UniPin {country.name} Region right now
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default CareersPage;
