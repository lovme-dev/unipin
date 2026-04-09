import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ChevronDown } from "lucide-react";
import { useGeo } from "@/hooks/use-geo";
import RegionSelector, { getLanguageCode } from "@/components/RegionSelector";
import unipinLogo from "@/assets/unipin-logo.svg";
import LegalPageSections from "@/components/LegalPageSections";

const TermsAndConditions = () => {
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.title = "Website Terms & Conditions | UniPin - Legal Agreement";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Read UniPin website terms and conditions covering usage rules, intellectual property, third-party links, disclaimers, indemnification, and governing law.");
  }, []);

  const domainUrl = "www.unipin.pk";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: scrolled ? "blur(24px) saturate(140%) brightness(1.08)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(24px) saturate(140%) brightness(1.08)" : "none",
            background: scrolled
              ? "linear-gradient(180deg, hsl(var(--header-glow) / 0.28) 0%, hsl(var(--header-glow) / 0.12) 50%, transparent 100%)"
              : "linear-gradient(180deg, hsl(var(--header-glow) / 0.67) 0%, hsl(var(--header-glow) / 0.32) 45%, transparent 100%)",
            transition: "all 0.3s ease",
          }}
        />

        {/* Top Banner */}
        <div className="relative z-20 py-1.5 px-3 flex items-center justify-between text-[10px]">
          <span className="font-bold tracking-wide">INSTANT TOP UP! INSTANT PLAY!</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setRegionOpen(true)}>
              <img src={activeFlagUrl} alt={activeCountryName} className="w-5 h-5 rounded-full object-cover border border-white/20" />
            </button>

            {/* Desktop toggle */}
            <div className="hidden sm:flex rounded-lg overflow-hidden border border-white/15">
              <button onClick={() => setLang("local")} className={`px-2.5 py-1 text-xs font-semibold transition-colors ${lang === "local" ? "bg-primary text-primary-foreground" : "bg-[hsl(220,20%,22%)] text-foreground"}`}>
                {localLangCode}
              </button>
              <button onClick={() => setLang("en")} className={`px-2.5 py-1 text-xs font-semibold transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-[hsl(220,20%,22%)] text-foreground"}`}>
                EN
              </button>
            </div>

            {/* Mobile dropdown */}
            <div className="relative sm:hidden">
              <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-[hsl(220,20%,22%)] text-foreground text-[11px] font-semibold border border-white/10">
                {activeLangCode}
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[59]" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-[60] min-w-[52px] shadow-xl" style={{ background: "hsl(220,20%,18%)" }}>
                    <button onClick={() => { setLang("local"); setLangDropdownOpen(false); }} className={`w-full px-3 py-1.5 text-[11px] font-bold text-center transition-colors ${lang === "local" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"}`}>
                      {localLangCode}
                    </button>
                    <button onClick={() => { setLang("en"); setLangDropdownOpen(false); }} className={`w-full px-3 py-1.5 text-[11px] font-bold text-center transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"}`}>
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
            <Link to="/"><img src={unipinLogo} alt="UniPin" className="h-5" /></Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Search className="w-4.5 h-4.5 text-foreground" />
            <button className="bg-primary text-primary-foreground px-4 py-1 rounded-md text-xs font-bold tracking-wide">SIGN IN</button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-topbar h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-8">
              <img src={unipinLogo} alt="UniPin" className="h-8" />
              <button onClick={() => setMenuOpen(false)} className="text-foreground text-2xl font-bold">✕</button>
            </div>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Website Terms And Conditions</h1>
        <p className="text-sm text-muted-foreground mb-6">Updated at 2026-01-01</p>
        <div className="border-t border-border mb-8" />

        <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <p className="uppercase text-xs sm:text-sm tracking-wide">
            IT IS IMPORTANT THAT YOU READ CAREFULLY AND UNDERSTAND THE FOLLOWING TERMS AND CONDITIONS.
          </p>

          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and UNIPIN ("we," "us" or "our"), concerning your access to and use of the {domainUrl} website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Website").
          </p>

          <p>
            You agree that by accessing the Website, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree to these Terms and Conditions posted at the time you intend to access or use this website, please do not access or use this website, Product or any pages thereof.
          </p>

          <p>
            The term "UniPin" or "we" or "our" or "us" refers to PT Dua Puluh Empat Jam Online and/or its affiliates, including but not limited to Asia Digital Pte. Ltd., UniPin (Labuan) Limited, UniPin Phils. Inc., UniPin (M) Sdn. Bhd., UniPin (Thailand) Limited, UniPin (India) Private Limited, UniPay Sdn. Bhd. and the term "you" refer to the user or viewer of this website and/or Product.
          </p>

          <p>
            Any new features, upgrades, variations or new packages which are added to this website shall also be subject to these Terms and Conditions. UniPin reserves the right at its absolute and sole discretion to vary, modify, delete, update or suspend these Terms and Conditions (or any part thereof) for any reason, without prior notice to you. As such, you understand and acknowledge that it is your duty to review these Terms and Conditions on a regular basis. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by your continued use of the Website after the date such revised Terms and Conditions are posted.
          </p>

          <p>
            The information provided on the Website is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.
          </p>

          <p>
            UniPin website content is displayed in various languages for the purposes of enhancing user experience and interaction. Save as otherwise expressly stated, the use and display of any particular language or translation are purely to enhance user experience and shall not in any way be interpreted that UniPin is targeting or operating specifically in any particular country. UniPin operates on the world wide web and caters to the language needs of its users internationally.
          </p>

          <p>
            Accordingly, those persons who choose to access the Website from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
          </p>

          <p>
            These Terms and Conditions apply to your use of all of this website. You acknowledge that you are aware of the contents of and agree to be legally bound by these Terms and Conditions.
          </p>

          {/* GENERAL REQUIREMENTS */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">GENERAL REQUIREMENTS FOR USE OF THE WEBSITE</h2>

          <p>
            <strong className="text-foreground">Age.</strong> The Website is intended for users who are at least aged 18 years or older (or equivalent minimum age in the relevant jurisdiction), unless you are under 18 years old and your account was provided to you as a result of a request by your parent or guardian. Parents and guardians should also remind any minors that conversing with strangers on the Internet can be dangerous and take appropriate precautions to protect children, including monitoring their use of the Website.
          </p>

          <p>
            To use the Website, you cannot be a person barred from receiving the Website under the laws of any relevant applicable jurisdictions, including the country in which you reside or from where you use the Website.
          </p>

          <p>
            <strong className="text-foreground">Account.</strong> When you access our Website, you may be required to register an account ("Account"). By registering for an Account or by using our Website in any capacity, you represent that you are at least 18 years old (or equivalent minimum age in the relevant jurisdiction) and you understand and agree to these Terms and Conditions. If you are under the age of 18 (or equivalent minimum age in the relevant jurisdiction), you represent that your parents or your legal guardian has reviewed and agreed to these Terms and Conditions. If you access our Website through a third party platform, you are obligated to comply with their terms and conditions in addition to our Terms and Conditions.
          </p>

          <p>
            When you register for an account or update the information, you agree to provide us with accurate information and that you will keep it up-to-date at all times. You may never allow anyone else to use your account (except your parents or legal guardian). If you have reason to believe that your account is no longer secure, then you must immediately notify us at cs@unipin.pk. You are responsible for all activities that occur in your Account, whether or not you know about them.
          </p>

          <p>
            <strong className="text-foreground">Restrictions.</strong> When you access our Website, you agree not to:
          </p>

          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Website or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Website.</li>
            <li>Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the Website.</li>
            <li>Use the website to post contributions that are unlawful, obscene, vulgar, defamatory, abusive, damaging, disruptive, inappropriate, offensive, inaccurate, pornographic, vulgar, indecent, profane, hateful, racially or ethnically offensive, obscene, lewd, lascivious, filthy, threatening, excessively violent, harassing or otherwise objectionable.</li>
            <li>Access, tamper with or use other users' accounts.</li>
            <li>Unauthorised monitoring of data or traffic on the Website, probing, scanning or testing the vulnerability of any of the Website system or network, or breaching any security or authentication measures; circumventing any technological measure that protects the Website.</li>
          </ul>

          <p>
            You acknowledge that we have the right to monitor your access to and the use of the Website to ensure your compliance with these Terms and Conditions, or to comply with applicable law or the order or requirement of a court or other governmental body. However, we do not undertake to do so and you shall take responsibility of your own actions in accessing and using the Website.
          </p>

          {/* INTELLECTUAL PROPERTY */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">INTELLECTUAL PROPERTY RIGHTS</h2>

          <p>
            Unless otherwise indicated, the Website is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Website (collectively, the "Content") and the trademarks, product marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
          </p>

          <p>
            The Content and the Marks are provided on the Website "AS IS" for your information and personal use only. Except as expressly provided in these Terms and Conditions, no part of the Website and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </p>

          <p>
            Provided that you are eligible to use the Website, you are granted a limited license to access and use the Site for your personal, non-commercial use. We reserve all rights not expressly granted to you in and to the Website, the Content and the Marks.
          </p>

          {/* THIRD PARTY */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">LINKS TO THIRD-PARTY WEBSITES</h2>

          <p>
            The Website may contain (or you may be sent via the Website) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content").
          </p>

          <p>
            Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Site or any Third-Party Content posted on, available through, or installed from the Website, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content.
          </p>

          <p>
            Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Website and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Terms and Conditions no longer govern.
          </p>

          <p>
            You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Website or relating to any applications you use or install from the Website. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party.
          </p>

          <p>
            You agree and acknowledge that we do not endorse the products offered on Third-Party Websites and you shall hold us harmless from any harm caused by your purchase of such products. Additionally, you shall hold us harmless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.
          </p>

          {/* DISCLAIMER */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">DISCLAIMER</h2>

          <p className="uppercase text-xs sm:text-sm">
            YOU EXPRESSLY UNDERSTAND AND AGREE THAT THE CONTENT, INFORMATION, LINKS, FUNCTIONALITY OF THIS WEBSITE AND PRODUCT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE AND OUR AFFILIATES (AND OUR AND THEIR RESPECTIVE EMPLOYEES, DIRECTORS, AGENTS AND REPRESENTATIVES), PARTNERS AND LICENSORS EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF NON INFRINGEMENT OF THIRD PARTY RIGHTS, TITLE, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND FREEDOM FROM COMPUTER VIRUS OR OTHER HARMFUL COMPONENTS. WITHOUT IN ANY WAY LIMITING THE PRIOR SENTENCE AND TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, THAT (I) THE PRODUCT WILL MEET YOUR REQUIREMENTS; (II) YOUR USE OF THE PRODUCT AND/OR WEBSITE WILL BE TIMELY, UNINTERRUPTED, SECURE OR ERROR-FREE; (III) THE CONTENT AND INFORMATION OF THIS WEBSITE IS ACCURATE, SECURE, COMPLETE OR OTHERWISE FREE FROM ERRORS AND OMISSIONS; (IV) THE LINKS AND OTHER ASPECTS OF THE WEBSITE ARE FUNCTIONAL; OR (V) ANY DEFECTS OR ERRORS IN THE SOFTWARE PROVIDED TO YOU AS PART OF THE PRODUCT WILL BE CORRECTED.
          </p>

          <p className="uppercase text-xs sm:text-sm">
            UNIPIN DOES NOT REPRESENT OR GUARANTEE THAT THE PRODUCT WILL BE FREE FROM LOSS, CORRUPTION, ATTACK, VIRUSES, INTERFERENCE, HACKING, OR OTHER SECURITY INTRUSION, AND UNIPIN DISCLAIMS ANY LIABILITY RELATING THERETO.
          </p>

          <p>
            You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
          </p>

          <p>
            Your use of any information, material, or products on this website is entirely at your own discretion and risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, or information available through this website meet your specific requirements. You will be solely responsible for any damage to your device, computer, or loss of data that results from the use of the Product and/or website.
          </p>

          {/* INDEMNIFICATION */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">INDEMNIFICATION</h2>

          <p>
            You agree to indemnify, defend and hold UniPin, its affiliates, and their respective officers, directors, employees, agents, licensors, representatives, partners, and third party providers harmless from and against any and all claims, demand, losses, expenses, damages and costs, including but not limited to attorneys' fees, relating to or arising from: (a) your use of the Product and/or website; (b) any violation of these Terms and Conditions by you; (c) any action taken by UniPin as part of its investigation of a suspected violation of these Terms and Conditions or as a result of its finding or decision that a violation of these Terms and Conditions has occurred; or (d) any violation of any rights of another by you. This means that you cannot sue UniPin, its affiliates, and their respective officers, directors, employees, agents, licensors, representatives, partners, and third party providers as a result of its decision to remove or refuse to process any information or Content, to warn you, to suspend or terminate your access to the Product, or to take any other action during the investigation of a suspected violation or as a result of UniPin's conclusion that a violation of these Terms and Conditions has occurred.
          </p>

          <p>
            This waiver and indemnity provision apply to all violations described in or contemplated by these Terms and Conditions. This obligation shall survive the termination or expiration of these Terms and Conditions and/or your use of the Product. You acknowledge that you are responsible for all use of the Product using your account, and that these Terms and Conditions apply to any and all usage of your account. You agree to comply with these Terms and Conditions and to defend, indemnify and hold UniPin harmless from and against any and all claims and demands arising from usage of your Account, whether or not such usage is expressly authorized by you.
          </p>

          {/* GOVERNING LAW */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">GOVERNING LAW & JURISDICTION</h2>

          <p>
            Notwithstanding from where you gain or attempt to gain access to this Website and/or the products herein, you agree that this Terms & Conditions, your performance and conduct under it, your access to this Website and use of the products herein, content and any disputes arising thereunder shall, at all times, be governed by and construed in accordance with the laws of Malaysia without regard to its conflicts-of-law provisions, and you and UniPin agree to submit to the exclusive jurisdiction of the Malaysia courts.
          </p>
        </div>
      </div>

      <LegalPageSections />

      {/* Footer */}
      <footer className="bg-topbar">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          {/* Desktop: 4-column layout / Mobile: stacked centered */}
          <div className="flex flex-col sm:flex-row sm:gap-12 gap-8">
            {/* UniPin Brand */}
            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <img src={unipinLogo} alt="UniPin" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Universal Pin is the leading Digital Content Enabler that focus only on online games and digital products across the world.
              </p>
            </div>

            {/* Product & Service */}
            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <h3 className="font-bold text-foreground mb-3">Product & Service</h3>
              <div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground">
                <span>Games</span>
                <span>Voucher Purchase</span>
                <span>SEACA eSports & Community</span>
                <span>Payment Channels</span>
              </div>
            </div>

            {/* Support & Information */}
            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <h3 className="font-bold text-foreground mb-3">Support & Information</h3>
              <div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground">
                <span>UP Station Media</span>
                <span>Promo & Events</span>
                <span>FAQ</span>
                <span>Customer Support</span>
              </div>
            </div>

            {/* Corporate & Partnership */}
            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <h3 className="font-bold text-foreground mb-3">Corporate & Partnership</h3>
              <div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground">
                <span>About Us</span>
                <span>Partnership Program</span>
                <span>UniPin Affiliates Program</span>
                <span>Careers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-1">
              Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-1">
              Kementerian Perdagangan Republik Indonesia
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-1">
              WhatsApp: <a href="https://wa.me/447476966269" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+44 747-6966269</a>
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-4">
              To submit suggestions, complaints or concerns, consumers can contact: <a href="https://wa.me/447476966269" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+44 747-6966269</a>
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-muted-foreground text-center sm:text-left">© 2026 UniPin. All Rights Reserved</p>
              <div className="flex justify-center sm:justify-start gap-4 text-xs text-primary flex-wrap">
                <Link to="/terms-and-conditions" className="hover:underline">Website Terms and Conditions</Link>
                <Link to="/user-terms" className="hover:underline">User Terms & Conditions</Link>
                <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
              </div>
              <div className="flex justify-center sm:justify-end">
                <img src={activeFlagUrl} alt={activeCountryName} className="w-7 h-7 rounded-full object-cover border border-white/20" />
              </div>
            </div>
          </div>
        </div>
      </footer>

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

export default TermsAndConditions;
