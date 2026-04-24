import { useEffect, useState } from "react";
import { ChevronLeft, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import MobileMenu from "@/components/MobileMenu";
import { useGeo } from "@/hooks/use-geo";
import { getCountryData } from "@/data/countries";
import { getTranslations } from "@/i18n/translations";
import unipinLogo from "@/assets/unipin-logo.svg";
import visaMastercardImg from "@/assets/visa-mastercard.png";
import easypaisaLogo from "@/assets/easypaisa-logo.png";
import jazzcashLogo from "@/assets/jazzcash-logo.png";
import gopayFastLogo from "@/assets/gopay-fast-logo.png";

type Tab = "card" | "vouchers" | "ewallet";

const PaymentChannelsPage = () => {
  const navigate = useNavigate();
  const geo = useGeo();
  const country = getCountryData(geo.countryCode);
  const t = getTranslations("EN");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("card");

  const isPK = country.code === "PK";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cardChannels = [
    { name: "Card Payment", logo: visaMastercardImg },
    { name: "Card Payment", logo: visaMastercardImg },
  ];

  const ewalletChannels = isPK
    ? [
        { name: "EasyPaisa", logo: easypaisaLogo },
        { name: "JazzCash", logo: jazzcashLogo },
        { name: "GoPay Fast", logo: gopayFastLogo },
      ]
    : [];

  const voucherChannels: { name: string; logo: string }[] = [];

  return (
    <>
      <SEOHead
        title={`Payment Channels – UniPin ${country.name} | Cards, E-wallets & Vouchers`}
        description={`See all payment channels supported on UniPin ${country.name} — debit/credit cards, e-wallets like EasyPaisa, JazzCash, GoPay Fast and physical vouchers.`}
        countryCode={country.code}
        countryName={country.name}
        canonicalPath="/payment-channels"
      />
      <div className="min-h-screen bg-background text-foreground">
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
            <span className="text-[10px] text-foreground/80">{country.name}</span>
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

        <main className="px-4 py-6 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-foreground"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
            <h1 className="text-xl font-bold">Payment Channels</h1>
          </button>

          {/* Tabs */}
          <div className="flex items-end gap-8 border-b border-border/40 mb-8">
            <button
              onClick={() => setTab("card")}
              className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${
                tab === "card" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              DEBIT / CREDIT CARD
              {tab === "card" && (
                <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-primary rounded-full" />
              )}
            </button>
            {isPK && (
              <button
                onClick={() => setTab("ewallet")}
                className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${
                  tab === "ewallet" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                E-WALLET
                {tab === "ewallet" && (
                  <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-primary rounded-full" />
                )}
              </button>
            )}
            <button
              onClick={() => setTab("vouchers")}
              className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${
                tab === "vouchers" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              PHYSICAL VOUCHERS
              {tab === "vouchers" && (
                <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Channels grid */}
          {tab === "card" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cardChannels.map((c, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 flex flex-col items-center justify-center gap-3"
                  style={{ background: "hsl(220, 30%, 16%)" }}
                >
                  <div className="bg-white rounded-md px-3 py-2">
                    <img src={c.logo} alt={c.name} className="h-8 object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "ewallet" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ewalletChannels.map((c, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 flex flex-col items-center justify-center gap-3"
                  style={{ background: "hsl(220, 30%, 16%)" }}
                >
                  <div className="bg-white rounded-md px-3 py-2">
                    <img src={c.logo} alt={c.name} className="h-8 object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "vouchers" && (
            <div className="text-center text-muted-foreground py-12">
              {voucherChannels.length === 0
                ? `No physical vouchers available in ${country.name} right now.`
                : null}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PaymentChannelsPage;
