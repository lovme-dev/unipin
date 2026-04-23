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
import aovImg from "@/assets/aov.jpeg";
import codmImg from "@/assets/codm.jpeg";
import ffmaxImg from "@/assets/ffmax.jpeg";
import speedDriftersImg from "@/assets/speed-drifters.jpeg";
import undawnImg from "@/assets/undawn.jpeg";
import visaMastercardImg from "@/assets/visa-mastercard.png";
import easypaisaLogo from "@/assets/easypaisa-logo.png";
import jazzcashLogo from "@/assets/jazzcash-logo.png";
import gopayFastLogo from "@/assets/gopay-fast-logo.png";
import diamondsChestImg from "@/assets/diamonds-chest.png";

const diamondPackages = [
  { diamonds: 3000, bonus: 1500, pkrPrice: 3800 },
  { diamonds: 6000, bonus: 2300, pkrPrice: 8400 },
  { diamonds: 10000, bonus: 3200, pkrPrice: 12600 },
  { diamonds: 16000, bonus: 5500, pkrPrice: 21000 },
  { diamonds: 25000, bonus: 3500, pkrPrice: 42000 },
  { diamonds: 30000, bonus: 6000, pkrPrice: 46785 },
  { diamonds: 32000, bonus: 6500, pkrPrice: 49750 },
  { diamonds: 34000, bonus: 7000, pkrPrice: 53150 },
  { diamonds: 36000, bonus: 7500, pkrPrice: 56650 },
  { diamonds: 38000, bonus: 8000, pkrPrice: 60050 },
  { diamonds: 40000, bonus: 8500, pkrPrice: 63550 },
  { diamonds: 42000, bonus: 9000, pkrPrice: 67050 },
  { diamonds: 44000, bonus: 9500, pkrPrice: 70550 },
  { diamonds: 46000, bonus: 10000, pkrPrice: 74050 },
  { diamonds: 48000, bonus: 10500, pkrPrice: 77550 },
  { diamonds: 65000, bonus: 20000, pkrPrice: 95000 },
  { diamonds: 100000, bonus: 30000, pkrPrice: 140000 },
  { diamonds: 160000, bonus: 50000, pkrPrice: 230000 },
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
  gameConfig?: {
    name: string;
    publisher: string;
    icon: string;
    currencyLabel: string; // e.g. "Diamonds" or "UC"
    packageImage: string;
    packageImages?: string[]; // tiered icons; index by quartile
    itemLabel: string; // bottom bar label e.g. "Diamonds" / "UC"
    aboutTitle?: string;
    description1?: string;
    description2?: string;
    aboutText?: string;
    moreGamesTitle?: string;
  };
}

const Index = ({ countryOverride, gameConfig }: IndexProps = {}) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [prevButtonEnabled, setPrevButtonEnabled] = useState(false);
  const purchaseBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [userId, setUserId] = useState(() => localStorage.getItem("unipin_player_id") || "");
  const [emailInput, setEmailInput] = useState(() => localStorage.getItem("unipin_email") || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [whereToFindOpen, setWhereToFindOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [lang, setLang] = useState<"local" | "en">("en");
  const [langManuallySet, setLangManuallySet] = useState(false);
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

  // Persist player ID and email to localStorage
  useEffect(() => { localStorage.setItem("unipin_player_id", userId); }, [userId]);
  useEffect(() => { localStorage.setItem("unipin_email", emailInput); }, [emailInput]);

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

  // Auto-pick default language per country: English-friendly → EN, others → local
  const ENGLISH_DEFAULT_COUNTRIES = new Set([
    "PK","US","GB","AU","CA","IN","NG","PH","SG","HK","ZA","IE","MT","CY",
    "BD","LK","MM","BN","KH","LA","MN","NZ"
  ]);
  useEffect(() => {
    if (langManuallySet) return;
    const shouldUseEnglish = ENGLISH_DEFAULT_COUNTRIES.has(activeCountryCode) || localLangCode === "EN";
    setLang(shouldUseEnglish ? "en" : "local");
  }, [activeCountryCode, localLangCode, langManuallySet]);

  const setLangManual = (l: "local" | "en") => { setLangManuallySet(true); setLang(l); };

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
                onClick={() => setLangManual("local")}
                className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                  lang === "local"
                    ? "bg-primary text-primary-foreground"
                    : "bg-[hsl(220,20%,22%)] text-foreground"
                }`}
              >
                {localLangCode}
              </button>
              <button
                onClick={() => setLangManual("en")}
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
                      onClick={() => { setLangManual("local"); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-1.5 text-[11px] font-bold text-center transition-colors ${lang === "local" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"}`}
                    >
                      {localLangCode}
                    </button>
                    <button
                      onClick={() => { setLangManual("en"); setLangDropdownOpen(false); }}
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
            <img src={gameConfig?.icon || freefireIcon} alt={gameConfig?.name || "Free Fire"} className="w-16 h-16 rounded-lg object-cover" />
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
              <h1 className="text-lg font-bold text-foreground">{gameConfig?.name || "Free Fire"}</h1>
              <p className="text-sm text-muted-foreground">{gameConfig?.publisher || "Garena"}</p>
            </div>
          </div>

          <p className={`game-summary-preview ${descExpanded ? "hidden" : ""}`}>
            {gameConfig?.description1 || t.gameDescription1}
          </p>

          {descExpanded && (
            <div className="text-sm text-muted-foreground space-y-4 mt-2">
              <p>{gameConfig?.description1 || t.gameDescription1}</p>
              <p>{gameConfig?.description2 || t.gameDescription2}</p>
              <h3 className="text-primary font-semibold text-sm">{gameConfig?.aboutTitle || t.aboutFreeFire}</h3>
              <p>{gameConfig?.aboutText || t.aboutFreeFireText}</p>
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
                Please hit on the refresh button after you're done with the purchase!
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
            {diamondPackages.map((pkg, i) => {
              // Tiered icon: split packages into 4 quartiles
              const tieredImg = gameConfig?.packageImages && gameConfig.packageImages.length > 0
                ? gameConfig.packageImages[Math.min(
                    gameConfig.packageImages.length - 1,
                    Math.floor((i / diamondPackages.length) * gameConfig.packageImages.length)
                  )]
                : (gameConfig?.packageImage || diamondsChestImg);
              return (
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
                <img src={tieredImg} alt={gameConfig?.currencyLabel || "Diamonds"} className="w-10 h-10 object-contain mb-1" />
                <p className="text-sm font-semibold text-foreground">
                  {pkg.diamonds.toLocaleString()} <span className="text-xs" style={{ color: '#ED9B26' }}>+{pkg.bonus.toLocaleString()}</span> {gameConfig?.currencyLabel || t.freeFireDiamonds}
                </p>
                <p className="text-sm font-bold text-price mt-1">{activeCurrencySymbol} {convert(pkg.pkrPrice).formatted}</p>
              </button>
              );
            })}
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
          <h2 className="text-xl font-bold text-foreground mb-4">{gameConfig?.moreGamesTitle || t.moreGarenaGames}</h2>
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
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="0"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.434 5.503 3.678 7.2V22l3.378-1.852c.9.25 1.855.384 2.944.384 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.065 12.439-2.55-2.722L5.5 14.439l5.5-5.878 2.613 2.722L18.5 8.561l-5.435 5.878z"/></svg>, label: t.messenger, href: undefined as string | undefined },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.016a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/></svg>, label: t.whatsapp, href: "https://wa.me/447476966269" },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8.5L4.2 7.4a.5.5 0 0 0-.7.7l8 6.3a1 1 0 0 0 1.2 0l8-6.3a.5.5 0 0 0-.7-.7L12 13.5z"/><path d="M3.5 7l8.5 6.7L20.5 7" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: t.emailLabel, href: undefined as string | undefined },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none"><circle cx="12" cy="12" r="10"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7" stroke="hsl(var(--primary-foreground))" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="17" r="1.1" fill="hsl(var(--primary-foreground))"/></svg>, label: t.faq, href: undefined as string | undefined },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/><path d="M8 10h.01M12 10h.01M16 10h.01" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round"/></svg>, label: t.provideFeedback, href: undefined as string | undefined },
          ].map((item) => (
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary/40 rounded-lg p-3 flex flex-col items-center justify-center min-w-[100px] flex-1 bg-primary/[0.07]"
              >
                <span className="text-primary mb-1">{item.icon}</span>
                <span className="text-xs text-foreground text-center">{item.label}</span>
              </a>
            ) : (
              <div
                key={item.label}
                className="border border-primary/40 rounded-lg p-3 flex flex-col items-center justify-center min-w-[100px] flex-1 bg-primary/[0.07]"
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
            {[
              <svg key="fb" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
              <svg key="yt" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>,
              <svg key="ig" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
              <svg key="tw" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
            ].map((icon) => (
              <span key={icon.key} className="cursor-pointer hover:opacity-80 transition-opacity">{icon}</span>
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
            <p className="text-primary">{selectedDiamond ? `${selectedDiamond.diamonds} ${gameConfig?.itemLabel || "Diamonds"}` : "-"}</p>
          </div>
          <div className="flex-1 px-2 py-1 border-l border-[hsl(31,92%,53%,0.2)]">
            <span className="text-muted-foreground">{t.payment}</span>
            <p className="text-primary">{selectedPayment || "-"}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2" style={{ background: 'hsl(0,0%,0%)' }}>
          <p className="font-bold">
            <span className="text-xs text-price">{activeCurrencySymbol}</span>{" "}
            <span className="text-base text-price">{selectedDiamond ? convert(selectedDiamond.pkrPrice).formatted : "0"}</span>
          </p>
          <button
            ref={purchaseBtnRef}
            disabled={!isFormComplete}
            onClick={() => {
              if (isFormComplete && selectedDiamond) {
                navigate("/checkout", {
                  state: {
                    diamonds: selectedDiamond.diamonds,
                    bonus: selectedDiamond.bonus,
                    price: convert(selectedDiamond.pkrPrice).formatted,
                    currency: activeCurrency,
                    currencySymbol: activeCurrencySymbol,
                    paymentMethod: selectedPayment,
                    rawPkrPrice: selectedDiamond.pkrPrice,
                    email: emailInput,
                  },
                });
              }
            }}
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
        onSelectLang={setLangManual}
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
