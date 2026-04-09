import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ChevronDown, ChevronUp, Info, MessageCircle, Mail, HelpCircle, MessageSquare } from "lucide-react";
import { useGeo } from "@/hooks/use-geo";
import RegionSelector, { getLanguageCode } from "@/components/RegionSelector";
import { getTranslations } from "@/i18n/translations";
import unipinLogo from "@/assets/unipin-logo.svg";
import freefireIcon from "@/assets/freefire-icon.jpg";
import aovImg from "@/assets/aov.jpg";
import codmImg from "@/assets/codm.jpg";
import ffmaxImg from "@/assets/ffmax.jpg";
import speedDriftersImg from "@/assets/speed-drifters.jpg";
import undawnImg from "@/assets/undawn.jpg";

const diamondPackages = [
  { diamonds: 5, price: "1.000" },
  { diamonds: 12, price: "2.000" },
  { diamonds: 50, price: "8.000" },
  { diamonds: 70, price: "10.000" },
  { diamonds: 140, price: "20.000" },
  { diamonds: 355, price: "50.000" },
  { diamonds: 720, price: "100.000" },
  { diamonds: 1450, price: "200.000" },
  { diamonds: 2180, price: "300.000" },
  { diamonds: 3640, price: "500.000" },
  { diamonds: 7290, price: "1.000.000" },
  { diamonds: 36500, price: "5.000.000" },
  { diamonds: 73100, price: "10.000.000" },
];

const paymentMethods = [
  {
    category: "Physical Voucher",
    methods: ["UniPin Voucher ID", "UP Gift Card"],
  },
  {
    category: "E-wallet",
    methods: ["UniPin Credits (IDR)", "DANA", "UP Points", "ShopeePay"],
  },
  {
    category: "Debit / Credit Card",
    methods: ["Debit / Credit Card"],
  },
];

const moreGames = [
  { name: "Arena of Valor", publisher: "Garena", price: "1,000", img: aovImg },
  { name: "Call of Duty Mobile", publisher: "Garena", price: "1,000", img: codmImg },
  { name: "Free Fire Max", publisher: "Garena", price: "1,000", img: ffmaxImg },
  { name: "Speed Drifters", publisher: "Garena", price: "1,000", img: speedDriftersImg },
  { name: "Undawn", publisher: "Garena", price: "1,000", img: undawnImg },
];

const Index = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [lang, setLang] = useState<"local" | "en">("local");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [manualCountry, setManualCountry] = useState<{ code: string; name: string } | null>(null);
  const geo = useGeo();

  const activeCountryCode = manualCountry?.code || geo.countryCode;
  const activeCountryName = manualCountry?.name || geo.countryName;
  const localLangCode = getLanguageCode(activeCountryCode);
  const activeLangCode = lang === "en" ? "EN" : localLangCode;
  const activeFlagUrl = `https://flagcdn.com/w40/${activeCountryCode.toLowerCase()}.png`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <span className="font-bold tracking-wide">INSTANT TOP UP! INSTANT PLAY!</span>
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
            <button className="bg-primary text-primary-foreground px-4 py-1 rounded-md text-xs font-bold tracking-wide">
              SIGN IN
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-topbar h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-8">
              <img src={unipinLogo} alt="UniPin" className="h-8" />
              <button onClick={() => setMenuOpen(false)} className="text-foreground text-2xl font-bold">✕</button>
            </div>
            {[
              { icon: "🎮", label: "Game" },
              { icon: "🎉", label: "Promotions and Events" },
              { icon: "🏪", label: "Points Exchange" },
              { icon: "👑", label: "Membership" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-3 text-foreground">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
            <div className="border-t border-border my-4" />
            {[
              { icon: "❓", label: "FAQ" },
              { icon: "🎧", label: "Customer Support" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-3 text-foreground">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
            <div className="border-t border-border my-4" />
            {[
              { icon: "🤝", label: "Partnership Program" },
              { icon: "👥", label: "Reseller Program" },
              { icon: "🏆", label: "SEACA eSports & Community" },
              { icon: "🏷️", label: "#ProudToPlayLocal" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-3 text-foreground">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-background/50" onClick={() => setMenuOpen(false)} />
        </div>
      )}

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
                  Official Distributor
                </span>
                <span className="game-meta-badge">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="game-meta-badge-icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.75 6.25h4.5" />
                    <path d="M2.75 12h3.35" />
                    <path d="M2.75 17.75h4.5" />
                    <circle cx="14.25" cy="12" r="6.25" />
                    <path d="M14.25 8.6V12l2.45 2.45" />
                  </svg>
                  Instant Top-Up
                </span>
                <span className="game-meta-badge hidden sm:inline-flex">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="game-meta-badge-icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.75 18 5.25v5.35c0 4.08-2.46 7.33-6 8.9-3.54-1.57-6-4.82-6-8.9V5.25l6-2.5Z" />
                    <rect x="9.2" y="10.6" width="5.6" height="4.6" rx="1" />
                    <path d="M10.5 10.6V9.4a1.5 1.5 0 0 1 3 0v1.2" />
                  </svg>
                  Secure Payment
                </span>
              </div>
              <h1 className="text-lg font-bold text-foreground">Free Fire</h1>
              <p className="text-sm text-muted-foreground">Garena</p>
            </div>
          </div>

          <p className={`game-summary-preview ${descExpanded ? "hidden" : ""}`}>
            Jangan biarkan permainan kamu terganggu karena kekurangan diamond! Sekarang kamu bisa <strong className="text-foreground">top up diamond FF</strong> dengan mudah dan cepat melalui UniPin. Bagaimana caranya? Kamu tinggal masukkan ID kamu lalu pilih nominal yang diinginkan. UniPin menyediakan pilihan mulai 5 sampai 73.100 Free Fire Diamonds. Kamu bisa menggunakannya untuk membeli karakter, <em>skin</em> hingga mendapatkan item eksklusif untuk mendukung permainanmu.
          </p>

          {descExpanded && (
            <div className="text-sm text-muted-foreground space-y-4 mt-2">
              <p>
                Jangan biarkan permainan kamu terganggu karena kekurangan diamond! Sekarang kamu bisa <strong className="text-foreground">top up diamond FF</strong> dengan mudah dan cepat melalui UniPin. Bagaimana caranya? Kamu tinggal masukkan ID kamu lalu pilih nominal yang diinginkan. UniPin menyediakan pilihan mulai 5 sampai 73.100 Free Fire Diamonds. Kamu bisa menggunakannya untuk membeli karakter, <em>skin</em> hingga mendapatkan item eksklusif untuk mendukung permainanmu.
              </p>
              <p>
                UniPin menyediakan pilihan opsi pembayaran yang beragam melalui DANA, Go-Pay, SAKUKU, DOKU Wallet, Telkomsel, True Money, AkuLaku, Yap!, BNI, BCA, CIMB Clicks, Permata, Mandiri, Danamon, Maybank BII, Indomaret, Alfamart, pembayaran via kartu kredit sampai pulsa. Tidak mau ribet? <strong className="text-foreground">Top up diamond FF</strong> bisa kamu lakukan tanpa harus registrasi, login dan tanpa kartu kredit. Di UniPin, semuanya transaksi bisa dilakukan tanpa ribet.
              </p>
              <h3 className="text-primary font-semibold text-sm">Tentang Free Fire</h3>
              <p>
                Dikembangkan oleh Garena, Free Fire adalah game <em>battle royale</em> yang bisa dimainkan via Android dan iOS. Popularitasnya sebagai game yang paling banyak diunduh menempatkan Free Fire sebagai "Best Popular Vote Game" dari Google Playstore tahun 2019 lalu.
              </p>
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
        <div className="bg-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-[16px] leading-none font-normal" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>1</span>
              <h2 className="text-lg font-bold text-foreground">Enter User ID</h2>
            </div>
            <button className="game-meta-badge flex items-center gap-1 text-[11px]">
              <Info className="w-3.5 h-3.5" />
              <span>Where To Find?</span>
            </button>
          </div>

          <div className="bg-secondary rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground font-medium">User ID</span>
              <span className="text-sm text-muted-foreground">User ID</span>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-3 mb-3">
            <span className="text-sm text-foreground font-medium">Email</span>
          </div>

          <p className="text-xs text-muted-foreground">
            To find your Player ID, tap your avatar in the top left corner of your screen. Your Player ID will be displayed below your username.
          </p>
        </div>
      </div>

      {/* Step 2: Pilih Jumlah */}
      <div className="mx-3 mt-4">
        <div className="bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-[16px] leading-none font-normal" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>2</span>
            <h2 className="text-lg font-bold text-foreground">Select Amount</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {diamondPackages.map((pkg, i) => (
              <button
                key={i}
                onClick={() => setSelectedPackage(i)}
                className={`bg-secondary rounded-lg p-3 text-left border transition-colors ${
                  selectedPackage === i ? "border-primary" : "border-transparent"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{pkg.diamonds.toLocaleString()} Free Fire Diamonds</p>
                <p className="text-sm font-bold text-price mt-1">IDR {pkg.price}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Pilih Saluran Pembayaran */}
      <div className="mx-3 mt-4">
        <div className="bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-[16px] leading-none font-normal" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>3</span>
            <h2 className="text-lg font-bold text-foreground">Select Payment Channel</h2>
          </div>
          <p className="text-sm text-primary mb-4 cursor-pointer">All Payment Channels</p>

          {paymentMethods.map((group) => (
            <div key={group.category} className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">{group.category}</h3>
              {group.methods.map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`w-full bg-secondary rounded-lg p-3 mb-2 flex items-center gap-3 text-left border transition-colors ${
                    selectedPayment === method ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                    <img src={unipinLogo} alt={method} className="h-4" />
                  </div>
                  <span className="text-sm text-foreground">{method}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* More Garena Games */}
      <div className="mx-3 mt-4">
        <div className="bg-card rounded-lg p-4">
          <h2 className="text-xl font-bold text-foreground mb-4">More Garena games.</h2>
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
                  <span className="text-[10px]">IDR</span> <span className="font-bold text-foreground">{game.price}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Support */}
      <div className="mx-3 mt-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Customer Support</h2>
        <p className="text-sm text-muted-foreground mb-4">contact us</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { icon: <MessageCircle className="w-6 h-6" />, label: "Messenger" },
            { icon: <span className="text-2xl">💬</span>, label: "Whatsapp" },
            { icon: <Mail className="w-6 h-6" />, label: "E-mail" },
            { icon: <HelpCircle className="w-6 h-6" />, label: "FAQ" },
            { icon: <MessageSquare className="w-6 h-6" />, label: "Provide feedback" },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-primary rounded-lg p-3 flex flex-col items-center justify-center min-w-[100px] flex-1"
            >
              <span className="text-primary mb-1">{item.icon}</span>
              <span className="text-xs text-foreground text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe */}
      <div className="mx-3 mt-6">
        <div className="bg-section rounded-lg p-4">
          <h2 className="text-lg font-bold text-foreground">SUBSCRIBE</h2>
          <p className="text-sm text-muted-foreground mb-4">Get the Best Deals Now!</p>
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
          Universal Pin is a leading payment service provider (PSP) that focuses its services on online games and other digital products spread throughout the world.
        </p>

        <h3 className="text-center font-bold text-foreground mb-3">Products and Services</h3>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>Game</span>
          <span>Voucher</span>
          <span>SEACA eSports & Community</span>
          <span>Payment Channels</span>
        </div>

        <h3 className="text-center font-bold text-foreground mb-3">Information and Support</h3>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>UP Station Media</span>
          <span>Promotions and Events</span>
          <span>FAQ</span>
          <span>Customer Support</span>
        </div>

        <h3 className="text-center font-bold text-foreground mb-3">Corporate and Partnership</h3>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>About UniPin</span>
          <span>Partnership Program</span>
          <span>UniPin Affiliates Program</span>
          <span>Career</span>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <p className="text-center text-xs text-muted-foreground mb-2">
            Directorate General of Consumer Protection and Trade Order,
          </p>
          <p className="text-center text-xs text-muted-foreground mb-2">
            Ministry of Trade of the Republic of Indonesia
          </p>
          <p className="text-center text-xs text-muted-foreground mb-2">
            WhatsApp: <span className="text-primary">0853-1111-1010</span>
          </p>
          <p className="text-center text-xs text-muted-foreground mb-4">
            To submit suggestions, complaints or grievances, consumers can contact: <span className="text-primary">+62 859-5959-3535</span>
          </p>
          <p className="text-center text-xs text-muted-foreground mb-2">© 2026 UniPin. All Rights Reserved</p>
          <div className="flex justify-center gap-4 text-xs text-primary flex-wrap">
            <Link to="/terms-and-conditions" className="hover:underline">Website Terms and Conditions</Link>
            <Link to="/user-terms" className="hover:underline">User Terms & Conditions</Link>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          </div>
          <div className="flex justify-center mt-3">
            <img src={activeFlagUrl} alt={activeCountryName} className="w-7 h-7 rounded-full object-cover border border-white/20" />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="flex text-[9px]" style={{ background: 'hsl(220,25%,16%)', borderTop: '1px solid hsl(31,92%,53%,0.3)' }}>
          <div className="flex-1 px-2 py-1">
            <span className="text-muted-foreground">User ID</span>
            <p className="text-primary">-</p>
          </div>
          <div className="flex-1 px-2 py-1 border-l border-[hsl(31,92%,53%,0.2)]">
            <span className="text-muted-foreground">Item</span>
            <p className="text-primary">{selectedDiamond ? `${selectedDiamond.diamonds} Diamonds` : "-"}</p>
          </div>
          <div className="flex-1 px-2 py-1 border-l border-[hsl(31,92%,53%,0.2)]">
            <span className="text-muted-foreground">Payment</span>
            <p className="text-primary">{selectedPayment || "-"}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2" style={{ background: 'hsl(0,0%,0%)' }}>
          <p className="font-bold">
            <span className="text-xs text-price">IDR</span>{" "}
            <span className="text-base text-price">{selectedDiamond ? selectedDiamond.price : "0"}</span>
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-bold text-xs">
            Purchase Now
          </button>
        </div>
      </div>

      <RegionSelector
        open={regionOpen}
        onOpenChange={setRegionOpen}
        selectedCountry={activeCountryCode}
        selectedLang={lang}
        onSelectCountry={(code, name) => setManualCountry({ code, name })}
        onSelectLang={setLang}
        localLangCode={localLangCode}
      />
    </div>
  );
};

export default Index;
