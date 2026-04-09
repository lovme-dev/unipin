import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Menu, Search, ChevronDown, ChevronUp, Info, MessageCircle, Mail, HelpCircle, MessageSquare, User } from "lucide-react";
import whereToFindImg from "@/assets/where-to-find-id.jpeg";
import MobileMenu from "@/components/MobileMenu";
import { useGeo } from "@/hooks/use-geo";
import { useCurrency } from "@/hooks/use-currency";
import { getCountryData } from "@/data/countries";
import RegionSelector, { getLanguageCode } from "@/components/RegionSelector";
import { getTranslations } from "@/i18n/translations";
import unipinLogo from "@/assets/unipin-logo.svg";
import AuthDialog from "@/components/AuthDialog";
import ProfileSheet from "@/components/ProfileSheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import freefireIcon from "@/assets/garena-logo.jpeg";
import aovImg from "@/assets/aov.jpg";
import codmImg from "@/assets/codm.jpg";
import ffmaxImg from "@/assets/ffmax.jpg";
import speedDriftersImg from "@/assets/speed-drifters.jpg";
import undawnImg from "@/assets/undawn.jpg";
import visaMastercardImg from "@/assets/visa-mastercard.png";
import easypaisaLogo from "@/assets/easypaisa-logo.png";
import jazzcashLogo from "@/assets/jazzcash-logo.png";
import gopayFastLogo from "@/assets/gopay-fast-logo.png";
import diamondsChestImg from "@/assets/diamonds-chest.png";

const diamondPackages = [
  { diamonds: 5, idrPrice: 1000 },
  { diamonds: 12, idrPrice: 2000 },
  { diamonds: 50, idrPrice: 8000 },
  { diamonds: 70, idrPrice: 10000 },
  { diamonds: 140, idrPrice: 20000 },
  { diamonds: 355, idrPrice: 50000 },
  { diamonds: 720, idrPrice: 100000 },
  { diamonds: 1450, idrPrice: 200000 },
  { diamonds: 2180, idrPrice: 300000 },
  { diamonds: 3640, idrPrice: 500000 },
  { diamonds: 7290, idrPrice: 1000000 },
  { diamonds: 36500, idrPrice: 5000000 },
  { diamonds: 73100, idrPrice: 10000000 },
];

const getPaymentMethods = (countryCode: string) => {
  const isPK = countryCode === "PK";
  const methods: { category: string; methods: { name: string; logo?: string }[] }[] = [];
  
  if (isPK) {
    methods.push({
      category: "E-wallet",
      methods: [
        { name: "EasyPaisa", logo: easypaisaLogo },
        { name: "JazzCash", logo: jazzcashLogo },
        { name: "GoPay Fast - All in One", logo: gopayFastLogo },
      ],
    });
  }
  
  methods.push({
    category: "Debit / Credit Card",
    methods: [{ name: "Debit / Credit Card", logo: visaMastercardImg }],
  });
  
  return methods;
};

const moreGames = [
  { name: "Arena of Valor", publisher: "Garena", price: "1,000", img: aovImg },
  { name: "Call of Duty Mobile", publisher: "Garena", price: "1,000", img: codmImg },
  { name: "Free Fire Max", publisher: "Garena", price: "1,000", img: ffmaxImg },
  { name: "Speed Drifters", publisher: "Garena", price: "1,000", img: speedDriftersImg },
  { name: "Undawn", publisher: "Garena", price: "1,000", img: undawnImg },
];

interface IndexProps {
  countryOverride?: { code: string; name: string; currency: string; currencySymbol: string };
}

const Index = ({ countryOverride }: IndexProps = {}) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [prevButtonEnabled, setPrevButtonEnabled] = useState(false);
  const purchaseBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [userId, setUserId] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [whereToFindOpen, setWhereToFindOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [lang, setLang] = useState<"local" | "en">("local");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [manualCountry, setManualCountry] = useState<{ code: string; name: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const geo = useGeo();

  // Listen to auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user?.email) setEmailInput(session.user.email);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user?.email) setEmailInput(session.user.email);
    });
    return () => subscription.unsubscribe();
  }, []);

  const activeCountryCode = countryOverride?.code || manualCountry?.code || geo.countryCode;
  const activeCountryName = countryOverride?.name || manualCountry?.name || geo.countryName;
  const countryData = getCountryData(activeCountryCode);
  const activeCurrency = countryOverride?.currency || countryData.currency;
  const activeCurrencySymbol = countryOverride?.currencySymbol || countryData.currencySymbol;
  const localLangCode = getLanguageCode(activeCountryCode);
  const activeLangCode = lang === "en" ? "EN" : localLangCode;
  const activeFlagUrl = `https://flagcdn.com/w40/${activeCountryCode.toLowerCase()}.png`;
  const t = getTranslations(activeLangCode);
  const { convert } = useCurrency(activeCurrency);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const paymentMethods = getPaymentMethods(activeCountryCode);
  const isFormComplete = userId.trim().length >= 8 && emailInput.trim().length > 0 && selectedPackage !== null && selectedPayment !== null;

  // Shake animation when button becomes enabled
  useEffect(() => {
    if (isFormComplete && !prevButtonEnabled) {
      purchaseBtnRef.current?.classList.add('animate-shake');
      setTimeout(() => purchaseBtnRef.current?.classList.remove('animate-shake'), 600);
    }
    setPrevButtonEnabled(isFormComplete);
  }, [isFormComplete, prevButtonEnabled]);

  const selectedDiamond = selectedPackage !== null ? diamondPackages[selectedPackage] : null;


  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: scrolled ? 'blur(24px) saturate(140%) brightness(1.08)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(140%) brightness(1.08)' : 'none',
            background: scrolled
              ? 'linear-gradient(180deg, hsl(var(--header-glow) / 0.28) 0%, hsl(var(--header-glow) / 0.12) 50%, transparent 100%)'
              : 'linear-gradient(180deg, hsl(var(--header-glow) / 0.67) 0%, hsl(var(--header-glow) / 0.32) 45%, transparent 100%)',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Top Banner */}
        <div className="relative z-20 py-1.5 px-3 flex items-center justify-between text-[10px]">
          <span className="font-bold tracking-wide">{t.instantTopUp}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setRegionOpen(true)}>
              <img src={activeFlagUrl} alt={activeCountryName} className="w-5 h-5 rounded-full object-cover border border-white/20" />
            </button>

            {/* Desktop: side-by-side toggle */}
            <div className="hidden sm:flex rounded-lg overflow-hidden border border-white/15">
              <button
                onClick={() => setLang("local")}
                className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                  lang === "local"
                    ? "bg-primary text-primary-foreground"
                    : "bg-[hsl(220,20%,22%)] text-foreground"
                }`}
              >
                {localLangCode}
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-[hsl(220,20%,22%)] text-foreground"
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile: dropdown */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-[hsl(220,20%,22%)] text-foreground text-[11px] font-semibold border border-white/10"
              >
                {activeLangCode}
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[59]" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-[60] min-w-[52px] shadow-xl" style={{ background: 'hsl(220,20%,18%)' }}>
                    <button
                      onClick={() => { setLang("local"); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-1.5 text-[11px] font-bold text-center transition-colors ${lang === "local" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"}`}
                    >
                      {localLangCode}
                    </button>
                    <button
                      onClick={() => { setLang("en"); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-1.5 text-[11px] font-bold text-center transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"}`}
                    >
                      EN
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Logo Bar */}
        <div className="relative z-10 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <img src={unipinLogo} alt="UniPin" className="h-5" />
          </div>
          <div className="flex items-center gap-2.5">
            <Search className="w-4.5 h-4.5 text-foreground" />
            {currentUser ? (
              <button onClick={() => setProfileOpen(true)}>
                <Avatar className="w-8 h-8 border border-white/20">
                  {currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture ? (
                    <AvatarImage src={currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture} alt="Profile" />
                  ) : null}
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <button onClick={() => { if (window.innerWidth < 640) navigate("/login"); else setAuthOpen(true); }} className="bg-primary text-primary-foreground px-4 py-1 rounded-md text-xs font-bold tracking-wide">
                {t.signIn}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} t={t} />

      {/* Game Info Section */}
      <div className="mx-3 mt-4">
        <div className="rounded-lg p-4" style={{ background: 'hsl(0, 0%, 0%)' }}>
          <div className="flex gap-3 mb-3">
            <img src={freefireIcon} alt="Free Fire" className="w-16 h-16 rounded-lg" />
            <div>
              <div className="game-meta-badges">
                <span className="game-meta-badge">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="game-meta-badge-icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.75 14.35 5l3.22-.2.98 3.08 2.8 1.6-1.3 2.95 1.3 2.97-2.8 1.58-.98 3.1-3.22-.22L12 21.25l-2.35-2.24-3.22.22-.98-3.1-2.8-1.58 1.3-2.97-1.3-2.95 2.8-1.6.98-3.08 3.22.2L12 2.75Z" />
                    <path d="m8.7 12.2 2.1 2.08 4.55-4.88" />
                  </svg>
                  {t.officialDistributor}
                </span>
                <span className="game-meta-badge">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="game-meta-badge-icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.75 6.25h4.5" />
                    <path d="M2.75 12h3.35" />
                    <path d="M2.75 17.75h4.5" />
                    <circle cx="14.25" cy="12" r="6.25" />
                    <path d="M14.25 8.6V12l2.45 2.45" />
                  </svg>
                  {t.instantTopUpBadge}
                </span>
                <span className="game-meta-badge hidden sm:inline-flex">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="game-meta-badge-icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.75 18 5.25v5.35c0 4.08-2.46 7.33-6 8.9-3.54-1.57-6-4.82-6-8.9V5.25l6-2.5Z" />
                    <rect x="9.2" y="10.6" width="5.6" height="4.6" rx="1" />
                    <path d="M10.5 10.6V9.4a1.5 1.5 0 0 1 3 0v1.2" />
                  </svg>
                  {t.securePayment}
                </span>
              </div>
              <h1 className="text-lg font-bold text-foreground">Free Fire</h1>
              <p className="text-sm text-muted-foreground">Garena</p>
            </div>
          </div>

          <p className={`game-summary-preview ${descExpanded ? "hidden" : ""}`}>
            {t.gameDescription1}
          </p>

          {descExpanded && (
            <div className="text-sm text-muted-foreground space-y-4 mt-2">
              <p>{t.gameDescription1}</p>
              <p>{t.gameDescription2}</p>
              <h3 className="text-primary font-semibold text-sm">{t.aboutFreeFire}</h3>
              <p>{t.aboutFreeFireText}</p>
            </div>
          )}

          <button onClick={() => setDescExpanded(!descExpanded)} className="w-full flex justify-center mt-3">
            {descExpanded ? (
              <ChevronUp className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Step 1: Masukkan ID Pengguna */}
      <div className="mx-3 mt-4">
        <div className="rounded-lg p-4 border border-white/[0.10]" style={{ background: 'hsl(221 30% 24% / 0.68)', backdropFilter: 'blur(26px) saturate(135%)', WebkitBackdropFilter: 'blur(26px) saturate(135%)' }}>
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-[16px] leading-none font-normal flex-shrink-0" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>1</span>
                <h2 className="text-lg font-bold text-foreground truncate">{t.enterUserId}</h2>
              </div>
              <button
                onClick={() => setWhereToFindOpen(!whereToFindOpen)}
                className="game-meta-badge flex items-center gap-1 text-[11px] flex-shrink-0 whitespace-nowrap ml-2"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{t.whereToFind}</span>
              </button>
            </div>

          {/* Where to Find guide image */}
          {whereToFindOpen && (
            <div className="mb-3 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-primary self-end mr-8" />
              <div className="rounded-xl overflow-hidden border border-primary/30 shadow-lg shadow-primary/10 w-full max-w-[320px]">
                <img src={whereToFindImg} alt="Where to find your ID" className="w-full h-auto" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center px-4">
                {t.whereToFindHint || "Please hit on the refresh button after you're done with the purchase!"}
              </p>
            </div>
          )}

          <div className="rounded-lg p-3 mb-3 border border-white/[0.06]" style={{ background: 'hsl(220 20% 11% / 0.92)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground font-medium">{t.userId}</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                minLength={8}
                maxLength={15}
                placeholder={t.userId}
                value={userId}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                  setUserId(val);
                }}
                className="bg-transparent text-right text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/50 w-1/2"
              />
            </div>
          </div>

          <div className="rounded-lg p-3 mb-3 border border-white/[0.06]" style={{ background: 'hsl(220 20% 11% / 0.92)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground font-medium">{t.email}</span>
              <input
                type="email"
                placeholder={currentUser ? '' : 'Enter your email'}
                value={emailInput}
                onChange={(e) => { if (!currentUser) setEmailInput(e.target.value); }}
                readOnly={!!currentUser}
                className={`bg-transparent text-right text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/50 w-2/3 ${currentUser ? 'cursor-default' : ''}`}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {t.playerIdHint}
          </p>
        </div>
      </div>

      {/* Step 2: Pilih Jumlah */}
      <div className="mx-3 mt-4">
        <div className="rounded-lg p-4 border border-white/[0.10]" style={{ background: 'hsl(221 30% 24% / 0.68)', backdropFilter: 'blur(26px) saturate(135%)', WebkitBackdropFilter: 'blur(26px) saturate(135%)' }}>
          <div className="flex items-center gap-2 mb-4 min-w-0">
            <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-[16px] leading-none font-normal flex-shrink-0" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>2</span>
            <h2 className="text-lg font-bold text-foreground truncate">{t.selectAmount}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {diamondPackages.map((pkg, i) => (
              <button
                key={i}
                onClick={() => setSelectedPackage(i)}
                className={`relative bg-secondary rounded-lg p-3 text-left border-2 transition-colors ${
                  selectedPackage === i ? "border-primary" : "border-transparent"
                }`}
              >
                {selectedPackage === i && (
                  <div className="absolute top-0 right-0 w-6 h-6 bg-primary rounded-bl-lg rounded-tr-md flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                  </div>
                )}
                <img src={diamondsChestImg} alt="Diamonds" className="w-10 h-10 object-contain mb-1" />
                <p className="text-sm font-semibold text-foreground">{pkg.diamonds.toLocaleString()} {t.freeFireDiamonds}</p>
                <p className="text-sm font-bold text-price mt-1">{activeCurrencySymbol} {convert(pkg.idrPrice).formatted}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Pilih Saluran Pembayaran */}
      <div className="mx-3 mt-4">
        <div className="rounded-lg p-4 border border-white/[0.10]" style={{ background: 'hsl(221 30% 24% / 0.68)', backdropFilter: 'blur(26px) saturate(135%)', WebkitBackdropFilter: 'blur(26px) saturate(135%)' }}>
          <div className="flex items-center gap-2 mb-2 min-w-0">
            <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-[16px] leading-none font-normal flex-shrink-0" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>3</span>
            <h2 className="text-lg font-bold text-foreground truncate">{t.selectPaymentChannel}</h2>
          </div>
          <p className="text-sm text-primary mb-4 cursor-pointer">{t.allPaymentChannels}</p>

          {paymentMethods.map((group) => (
            <div key={group.category} className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {group.category === "E-wallet" ? t.eWallet : t.debitCreditCard}
              </h3>
              {group.methods.map((method) => (
                <button
                  key={method.name}
                  onClick={() => setSelectedPayment(method.name)}
                  className={`w-full bg-secondary rounded-lg p-3 mb-2 flex items-center gap-3 text-left border transition-colors ${
                    selectedPayment === method.name ? "border-primary" : "border-transparent"
                  }`}
                >
                  {method.logo && (
                    <img src={method.logo} alt={method.name} className="h-6 w-auto object-contain" />
                  )}
                  <span className="text-sm text-foreground">{method.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* More Garena Games */}
      <div className="mx-3 mt-4">
        <div className="rounded-lg p-4 border border-white/[0.10]" style={{ background: 'hsl(221 30% 24% / 0.68)', backdropFilter: 'blur(26px) saturate(135%)', WebkitBackdropFilter: 'blur(26px) saturate(135%)' }}>
          <h2 className="text-xl font-bold text-foreground mb-4">{t.moreGarenaGames}</h2>
          <div className="grid grid-cols-3 gap-3">
            {moreGames.map((game) => (
              <div key={game.name}>
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full aspect-square rounded-lg object-cover"
                  loading="lazy"
                />
                <p className="text-xs font-semibold text-foreground mt-1">{game.name}</p>
                <p className="text-[10px] text-muted-foreground">{game.publisher}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-[10px]">{activeCurrencySymbol}</span> <span className="font-bold text-foreground">{convert(1000).formatted}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Support */}
      <div className="mx-3 mt-6">
        <h2 className="text-xl font-bold text-foreground mb-1">{t.customerSupport}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t.contactUs}</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { icon: <MessageCircle className="w-6 h-6" />, label: t.messenger, href: undefined as string | undefined },
            { icon: <span className="text-2xl">💬</span>, label: t.whatsapp, href: "https://wa.me/447476966269" },
            { icon: <Mail className="w-6 h-6" />, label: t.emailLabel, href: undefined as string | undefined },
            { icon: <HelpCircle className="w-6 h-6" />, label: t.faq, href: undefined as string | undefined },
            { icon: <MessageSquare className="w-6 h-6" />, label: t.provideFeedback, href: undefined as string | undefined },
          ].map((item) => (
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary rounded-lg p-3 flex flex-col items-center justify-center min-w-[100px] flex-1"
              >
                <span className="text-primary mb-1">{item.icon}</span>
                <span className="text-xs text-foreground text-center">{item.label}</span>
              </a>
            ) : (
              <div
                key={item.label}
                className="border border-primary rounded-lg p-3 flex flex-col items-center justify-center min-w-[100px] flex-1"
              >
                <span className="text-primary mb-1">{item.icon}</span>
                <span className="text-xs text-foreground text-center">{item.label}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Subscribe */}
      <div className="mx-3 mt-6">
        <div className="rounded-lg p-4 border border-white/[0.10]" style={{ background: 'hsl(221 30% 24% / 0.68)', backdropFilter: 'blur(26px) saturate(135%)', WebkitBackdropFilter: 'blur(26px) saturate(135%)' }}>
          <h2 className="text-lg font-bold text-foreground">{t.subscribe}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t.getBestDeals}</p>
          <div className="flex gap-4">
            {["📘", "📷", "▶️", "🐦"].map((icon, i) => (
              <span key={i} className="text-2xl text-foreground">{icon}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 bg-topbar px-4 py-8">
        <div className="flex justify-center mb-4">
          <img src={unipinLogo} alt="UniPin" className="h-10" />
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">
          {t.footerDescription}
        </p>

        <h3 className="text-center font-bold text-foreground mb-3">{t.productsAndServices}</h3>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>{t.game}</span>
          <span>{t.voucher}</span>
          <span>{t.seacaEsports}</span>
          <span>{t.paymentChannels}</span>
        </div>

        <h3 className="text-center font-bold text-foreground mb-3">{t.informationAndSupport}</h3>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>{t.upStationMedia}</span>
          <span>{t.promotionsAndEvents}</span>
          <span>{t.faq}</span>
          <span>{t.customerSupport}</span>
        </div>

        <h3 className="text-center font-bold text-foreground mb-3">{t.corporateAndPartnership}</h3>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>{t.aboutUniPin}</span>
          <span>{t.partnershipProgram}</span>
          <span>{t.affiliatesProgram}</span>
          <span>{t.career}</span>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <p className="text-center text-xs text-muted-foreground mb-2">
            WhatsApp: <a href="https://wa.me/447476966269" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+44 747-6966269</a>
          </p>
          <p className="text-center text-xs text-muted-foreground mb-4">
            {t.suggestionsComplaint} <a href="https://wa.me/447476966269" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+44 747-6966269</a>
          </p>
          <p className="text-center text-xs text-muted-foreground mb-2">{t.allRightsReserved}</p>
          <div className="flex justify-center gap-4 text-xs text-primary flex-wrap">
            <Link to="/terms-and-conditions" className="hover:underline">{t.websiteTerms}</Link>
            <Link to="/user-terms" className="hover:underline">{t.userTermsConditions}</Link>
            <Link to="/privacy-policy" className="hover:underline">{t.privacyPolicyLink}</Link>
          </div>
          <div className="flex justify-center mt-3">
            <img src={activeFlagUrl} alt={activeCountryName} className="w-7 h-7 rounded-full object-cover border border-white/20" />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="flex text-[9px]" style={{ background: 'hsl(35, 12%, 22%)', borderTop: '1px solid hsl(31,92%,53%,0.3)' }}>
          <div className="flex-1 px-2 py-1">
            <span className="text-muted-foreground">{t.userId}</span>
            <p className="text-primary">{userId.trim() || "-"}</p>
          </div>
          <div className="flex-1 px-2 py-1 border-l border-[hsl(31,92%,53%,0.2)]">
            <span className="text-muted-foreground">{t.item}</span>
            <p className="text-primary">{selectedDiamond ? `${selectedDiamond.diamonds} Diamonds` : "-"}</p>
          </div>
          <div className="flex-1 px-2 py-1 border-l border-[hsl(31,92%,53%,0.2)]">
            <span className="text-muted-foreground">{t.payment}</span>
            <p className="text-primary">{selectedPayment || "-"}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2" style={{ background: 'hsl(0,0%,0%)' }}>
          <p className="font-bold">
            <span className="text-xs text-price">{activeCurrencySymbol}</span>{" "}
            <span className="text-base text-price">{selectedDiamond ? convert(selectedDiamond.idrPrice).formatted : "0"}</span>
          </p>
          <button
            ref={purchaseBtnRef}
            disabled={!isFormComplete}
            className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all ${
              isFormComplete
                ? "bg-primary text-primary-foreground"
                : "bg-primary/40 text-primary-foreground/50 cursor-not-allowed"
            }`}
          >
            {t.purchaseNow}
          </button>
        </div>
      </div>

      <RegionSelector
        open={regionOpen}
        onOpenChange={setRegionOpen}
        selectedCountry={activeCountryCode}
        selectedLang={lang}
        onSelectCountry={(code, name) => { setManualCountry({ code, name }); navigate(`/unipin/${code.toLowerCase()}`); }}
        onSelectLang={setLang}
        localLangCode={localLangCode}
      />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      {currentUser && (
        <ProfileSheet
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={currentUser}
          onLogout={async () => {
            await supabase.auth.signOut();
            setProfileOpen(false);
            toast.success("Logged out successfully");
          }}
        />
      )}
    </div>
  );
};

export default Index;
