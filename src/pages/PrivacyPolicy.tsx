import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ChevronDown } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { useGeo } from "@/hooks/use-geo";
import RegionSelector, { getLanguageCode } from "@/components/RegionSelector";
import { getTranslations } from "@/i18n/translations";
import unipinLogo from "@/assets/unipin-logo.svg";
import LegalPageSections from "@/components/LegalPageSections";

const PrivacyPolicy = () => {
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
  const activeFlagUrl = `https://flagcdn.com/w40/${activeCountryCode.toLowerCase()}.png`;
  const activeLangCode = lang === "en" ? "EN" : localLangCode;
  const t = getTranslations(activeLangCode);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.title = "Privacy Policy | UniPin - How We Protect Your Data";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Learn how UniPin collects, uses, and protects your personal data. Our privacy policy covers data security, cookies, your rights, and GDPR compliance.");
  }, []);

  const domainUrl = "www.unipin.pk";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backdropFilter: scrolled ? "blur(24px) saturate(140%) brightness(1.08)" : "none", WebkitBackdropFilter: scrolled ? "blur(24px) saturate(140%) brightness(1.08)" : "none", background: scrolled ? "linear-gradient(180deg, hsl(var(--header-glow) / 0.28) 0%, hsl(var(--header-glow) / 0.12) 50%, transparent 100%)" : "linear-gradient(180deg, hsl(var(--header-glow) / 0.67) 0%, hsl(var(--header-glow) / 0.32) 45%, transparent 100%)", transition: "all 0.3s ease" }} />
        <div className="relative z-20 py-1.5 px-3 flex items-center justify-between text-[10px]">
          <span className="font-bold tracking-wide">{t.instantTopUp}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setRegionOpen(true)}><img src={activeFlagUrl} alt={activeCountryName} className="w-5 h-5 rounded-full object-cover border border-white/20" /></button>
            <div className="hidden sm:flex rounded-lg overflow-hidden border border-white/15">
              <button onClick={() => setLang("local")} className={`px-2.5 py-1 text-xs font-semibold transition-colors ${lang === "local" ? "bg-primary text-primary-foreground" : "bg-[hsl(220,20%,22%)] text-foreground"}`}>{localLangCode}</button>
              <button onClick={() => setLang("en")} className={`px-2.5 py-1 text-xs font-semibold transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-[hsl(220,20%,22%)] text-foreground"}`}>EN</button>
            </div>
            <div className="relative sm:hidden">
              <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-[hsl(220,20%,22%)] text-foreground text-[11px] font-semibold border border-white/10">
                {activeLangCode}
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {langDropdownOpen && (<><div className="fixed inset-0 z-[59]" onClick={() => setLangDropdownOpen(false)} /><div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-[60] min-w-[52px] shadow-xl" style={{ background: "hsl(220,20%,18%)" }}><button onClick={() => { setLang("local"); setLangDropdownOpen(false); }} className={`w-full px-3 py-1.5 text-[11px] font-bold text-center transition-colors ${lang === "local" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"}`}>{localLangCode}</button><button onClick={() => { setLang("en"); setLangDropdownOpen(false); }} className={`w-full px-3 py-1.5 text-[11px] font-bold text-center transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"}`}>EN</button></div></>)}
            </div>
          </div>
        </div>
        <div className="relative z-10 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)}><Menu className="w-5 h-5 text-foreground" /></button>
            <Link to="/"><img src={unipinLogo} alt="UniPin" className="h-5" /></Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Search className="w-4.5 h-4.5 text-foreground" />
            <button className="bg-primary text-primary-foreground px-4 py-1 rounded-md text-xs font-bold tracking-wide">{t.signIn}</button>
          </div>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} t={t} />

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{t.privacyPolicyTitle}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t.updatedAt} 2026-01-01</p>
        <div className="border-t border-border mb-8" />

        <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Introduction</h2>
          <p>At UniPin, we are committed to protecting your Personal Information when you use our website, products and services. We recognize that when you choose to provide us with information about yourself, you trust us to treat it in a responsible manner.</p>
          <p>The purpose of this Website Privacy Policy is to inform you about how we may use your Personal Information and how our privacy practices conform to global data privacy laws and best practice such as the General Data Protection Regulation (GDPR) and other data privacy regulations.</p>
          <p>We aim to help you understand what personal data we collect, how we use that information, and what control you have over your personal data. This policy applies only to the data collected by <a href={`https://${domainUrl}`} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{domainUrl}</a>.</p>
          <p>This website Privacy Policy explains the following:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>What information we may collect about you.</li>
            <li>How we will use the information we collect about you.</li>
            <li>The security procedures implemented to protect your data.</li>
            <li>Where we may send your information.</li>
            <li>The use of cookies.</li>
            <li>Your choices and rights regarding the use of your data.</li>
            <li>How you can contact us for issues such as to correct inaccuracies of your data or to request the removal of your personal data.</li>
          </ul>
          <p>Please read the following privacy policy to understand the processing, collection, sharing, protection, and your rights associated with your personal data.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Who We Are</h2>
          <p>UniPin is a Digital Content Enabler that focuses only on online games and digital products across the world. It is our mission to offer seamless payment experiences at every level for the users and partners within the ecosystem, and to do so we collect and use personal data that you provide.</p>
          <p>For the purposes of this policy, we act as the "data controller." We take on this role as we determine how your personal data is used and processed.</p>
          <p>We have appointed a Data Protection Officer for assisting with questions, requests, and complaints in regards to this privacy policy and the collection and processing of your personal data. For details on how to contact us, see the Contact Information section at the end of this policy.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Data We Collect</h2>
          <p>When you participate in, access or sign up to any of the Company's services, activities or online content (including on social media and messaging applications), such as newsletters, promotions, live chats, message boards, web and mobile notifications or votes, we may receive Personal Information about you.</p>
          <p>This includes:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Full name</li><li>Email address</li><li>Username</li><li>Phone number</li><li>Address</li><li>Date of birth</li><li>IP Address and device Identifiers</li><li>Online game account identifiers</li><li>Credit / debit card information</li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">How We Use Your Data</h2>
          <p>Depending on your use of our site, we will use your personal information for a number of purposes including:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>To provide our services, activities or online content, or communicating information about them (e.g. relating to contests, promotions, surveys or other site features) or dealing with your requests and enquiries.</li>
            <li>To manage payments and provide credit or vouchers for online gameplay provided by 3rd party content publishers.</li>
            <li>To personalize your experience and provide you with better ways of accessing information from this website.</li>
            <li>For service administration, which means that we may contact you for reasons related to the service, activity or online content you have signed up for.</li>
            <li>To use IP addresses and device identifiers to identify the location of users, blocking disruptive use, establishing the number of visits from different countries, tailoring the content of our sites, apps or other services based on browsing behaviors, and determining the country from which you are accessing the services.</li>
            <li>For analysis and research so that we may improve the services we offer.</li>
            <li>For fraud detection.</li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Legal Basis of Processing</h2>
          <p>We collect and use the Personal Information about you for the purposes described above based on your consent and, because we have a legitimate business interest to do so that is not overridden by your right to have your Personal Information adequately protected. You do not have to provide us with any of the Personal Information described above, but if you chose not to do so, you may not be able to receive certain Company services, access certain parts of our website or receive information from us that you have requested.</p>
          <p>We also process personal data for other purposes with consent, but you have the right to withdraw consent to processing for specific purposes, as outlined below.</p>

          <h3 className="text-base font-semibold text-foreground pt-2">Specific Data Use</h3>
          <p>To fully access the website, you, as a user, may voluntarily register for an account by completing a registration form. Certain data is collected during this process, including your name and email address. This data is used to contact you, suggest appropriate products and services, and improve your user experience. By registering for an account, you have consented to our processing of your data.</p>
          <p>To place an order, as a registered user or guest, you must provide contact information (such as name, phone number, and email address) and financial information (such as credit or debit card number and expiration date). This data is used for billing and to fulfill your order. If there are issues with the order, we may use this information to contact you.</p>

          <h3 className="text-base font-semibold text-foreground pt-2">Marketing Communications</h3>
          <p>We may process your personal data for marketing purposes to keep you up to date with the latest products, services and promotions we have to offer. You may receive marketing communications from us if you have signed up to receive our newsletters, purchased products or services from us, or registered to any promotions we offer, and in each case, you have not opted-out of receiving those communications.</p>
          <p>If you no longer want to receive marketing communications from us, you can contact us at any time using the contact details below or by following the unsubscribe links in our marketing communications. If you opt-out of receiving marketing communications we may still process your personal data in order to fulfil contracts with you and in accordance with our legal, accounting and regulatory obligations.</p>
          <p>We will get your express opt-in consent before we share your personal data outside of our company for marketing purposes.</p>
          <p>Personal data may be used without knowledge or consent in situations when legally required or permitted, or when personal data has been anonymized or pseudonymized so it is no longer associated with the user. This means we have removed personally identifying information so the data we're left with cannot be tied back to you as an individual.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">How We Share Your Data</h2>
          <p>Personal data may be shared with regulators in compliance with legal regulations.</p>
          <p>Personal data may also be shared with third parties when it is necessary to provide services to users, and/or for other legitimate interests. Third parties include service providers such as game merchant, payment aggregator, payment channel provider, fraud detection service provider, marketing and promotional service providers and other related or associated services offered within UniPin's partner network.</p>
          <p>We may share the information that we collect, both personal and non-personal, with your consent to third parties such as advertisers, contest sponsors, promotional and marketing partners, and others who provide our content or whose products we think may interest you. We may also share it with our current and future affiliated companies and business partners, and if we are involved in a merger, asset sale or other business reorganization, we may also share or transfer your personal and non-personal information to our successors-in-interest.</p>
          <p>We may engage trusted third-party service providers to perform functions and provide services to us, such as hosting and maintaining our servers and the website, database storage and management, e-mail management, storage marketing, credit card processing, customer service and fulfilling orders for products you may purchase through the website. We will likely share your personal information, and possibly some non-personal information, with these third parties to enable them to perform these services for us and for you.</p>
          <p>We may share portions of our log file data, including IP addresses, for analytics purposes with third parties such as web analytics partners, application developers, fraud service provider and ad networks. If your IP address is shared, it may be used to estimate general location and other technographics such as connection speed, whether you have visited the website in a shared location, and type of the device used to visit the website. They may aggregate information about our advertising and what you see on the website and then provide auditing, research and reporting for us and our advertisers.</p>
          <p>We may also disclose personal and non-personal information about you to government or law enforcement officials or private parties as we, in our sole discretion, believe necessary or appropriate in order to respond to claims, legal process (including subpoenas), to protect our rights and interests or those of a third party, the safety of the public or any person, to prevent or stop any illegal, unethical, or legally actionable activity, or to otherwise comply with applicable court orders, laws, rules and regulations.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Where We Process Your Data</h2>
          <p>If you are visiting <a href={`https://${domainUrl}`} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{domainUrl}</a> from every country supported by UniPin, please be aware you are sending personal information to our servers located in Taiwan.</p>
          <p>Under certain circumstances, your personal data that we collect may be transferred to other countries for various purposes outlined below.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead><tr className="bg-topbar"><th className="border border-border px-3 py-2 text-left text-foreground">Country</th><th className="border border-border px-3 py-2 text-left text-foreground">Data Category</th><th className="border border-border px-3 py-2 text-left text-foreground">Purpose</th></tr></thead>
              <tbody><tr>
                <td className="border border-border px-3 py-2 align-top">Taiwan, Indonesia, Malaysia, Philippines, Brunei, Cambodia, Laos, Myanmar, Thailand, Argentina, Brazil, Colombia, Mexico, Algeria, Bahrain, Egypt, Kuwait, Morocco, Nigeria, Oman, Qatar, Saudi Arabia, South Africa, Turkey, United Arab Emirates, Bangladesh, Hong Kong, India, Japan, Pakistan, South Korea, Sri Lanka, Tunisia</td>
                <td className="border border-border px-3 py-2 align-top"><p className="mb-2"><strong className="text-foreground">Customer data</strong></p><p>Customer Data is used as a unique identifier of the customer identity eligible for credit top up for the Game Publisher and as a mandatory requirement for Payment Channel payment processing.</p><p className="mt-2"><strong className="text-foreground">Transactional data</strong></p><p>Transaction data gathered are used to capture evidence of successful transaction for the purpose of compliance requirement, accounting and audit and regulatory reporting.</p></td>
                <td className="border border-border px-3 py-2 align-top">Some payment channels require selected customer data e.g. identity number, contact details to be updated during payment processing to meet the compliance and regulatory requirement in the respective country where the payment transaction is processed.</td>
              </tr></tbody>
            </table>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">How Long We Store Your Data</h2>
          <p>We will only retain personal data for the duration necessary to fulfill the purposes for which it was collected. Personal data may also be retained for longer periods if it is solely for archiving purposes in the public interest, scientific or historical research purposes, or statistical purposes.</p>
          <p>Your Personal Data will be retained for as long as is necessary to fulfil or complete the purpose for which it was collected and until it is no longer necessary for any other legal or business purposes. Thereafter, we dispose of your Personal Data in a manner that prevents further access or processing, including but not limited to deletion or irreversible anonymization.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">How We Protect Your Data</h2>
          <p>UniPin makes reasonable efforts to safeguard your Personal Data, to protect against loss, misuse, modification, unauthorized or accidental access or disclosure, alteration, or destruction. Unfortunately, no data transmission or storage over the Internet can be guaranteed as totally secure. Nonetheless, we have adopted and currently practice administrative, organizational, technical, and physical security measures to protect your Personal Data to the best of our reasonable capacity, including but not limited to the following:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Limiting Personal Data access to authorized and/or necessary personnel;</li>
            <li>Implementing technical solutions to ensure information security;</li>
            <li>Continuous monitoring and review of Personal Data protection measures; and</li>
            <li>Other security measures, as may be required by the laws and regulations applicable in the country where you are located.</li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Use of Cookies</h2>
          <p>"Cookies" are a feature on your Internet browser which store small amounts of data on your computer when you visit a website. They allow us to recognize a particular device or browser so that we can personalize and curate content to your preferences and make our services and Platform more useful to you. "Cookies" do not tell us who you are unless you specifically give us personally identifiable information. You may be able to manage and delete "cookies" by selecting certain options on your browser.</p>
          <p>Cookies on <a href={`https://${domainUrl}`} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{domainUrl}</a> are used for various purposes. These "cookies" are data elements stored on your hard drive that allow us to improve your usage of our website. By using a cookie to identify you, you do not necessarily need to log in with a password more than once from the same browser, saving you time when accessing our site. In addition, we use cookies for advertising products based on your usage history, storing and managing your preferences on the website, enabling content, and generally analyzing your usage. Usage of cookies may be linked to your personal data on the website.</p>
          <p>We collect, and also allow third parties to collect statistical information relating to your website use and online activities as you interact with our Platform, using "cookies" and similar technologies. Such statistical information is anonymous in nature and does not identify who you are. They include page visits, access times and dates, and browser type. This information is collected for analysis and evaluation to help us improve our Platform and the UniPin Services.</p>
          <p>Your statistical data may be shared with our third-party partners: (i) with whom we advertise; (ii) who help us deliver or optimize our services; (iii) who wish to market their goods or services, which may be of interest to you; or (iv) who wish to improve their goods or services to be provided to you.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Your Rights Regarding Your Personal Data</h2>
          <p>We aim to maintain data that is accurate and up-to-date. Under the circumstance that your personal data changes (e.g. moving addresses), please notify us of any changes or update your data on your profile page.</p>
          <p>You have the following rights, which the Company will always work to uphold:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">Right to access</strong> – for a copy of the Personal Information we hold about you, and details about how we are processing your Personal Information. If we provide you with access to the information we hold about you, we will not charge you for this, unless your request is "manifestly unfounded or excessive". Where we are legally permitted to do so, we may refuse your request. If we refuse your request, we will tell you the reasons why.</li>
            <li><strong className="text-foreground">Right to correct</strong> – to have any inaccuracies in your Personal Information corrected.</li>
            <li><strong className="text-foreground">Right to erase</strong> – to have your Personal Information erased, or for our use of it to be restricted (for example, if your preferences change, or if you don't want us to send you the information you have requested).</li>
            <li><strong className="text-foreground">Right to restrict use</strong> – the right to "block" UniPin from using your data or limit the way in which we can use it.</li>
            <li><strong className="text-foreground">Right to data portability</strong> – if we are processing your Personal Information by automated means and on the basis of your consent, for us to provide your personal information to you in a structured, commonly used and machine-readable format. You can also ask us to provide your personal information directly to a third party in this format, and, if technically feasible, we will do so.</li>
            <li><strong className="text-foreground">Right to object</strong> – the right to object to our use of your data including where we use it for our legitimate interests.</li>
          </ul>
          <p>However, please note that if your Personal Data is removed or you withdraw your consent for any of the purposes stated above, depending on the nature of your request, we may not be in a position to continue providing UniPin services to you, or process and complete the transactions you wish to make on our Platform.</p>
          <p>Your Personal Data will be retained for as long as is necessary to fulfil or complete the purpose for which it was collected and until it is no longer necessary for any other legal or business purposes. Thereafter, we dispose of your Personal Data in a manner that prevents further access or processing, including but not limited to deletion or irreversible anonymization.</p>
          <p>To exercise these rights, please contact us via the email, mail, or phone information provided below in the "Contact Information" section.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">External Links</h2>
          <p>On our website, you may encounter links to other websites. Be aware that we are not responsible for the content or privacy practices of these other sites. We encourage all users to read the privacy policies of any other sites that collect your personal data. We are not responsible for the content, use, or privacy practices of these websites.</p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Contact Information</h2>
          <p>For any questions, concerns, or requests to exercise your rights outlined in this privacy policy, please contact us via email at <a href="mailto:privacy@unipin.pk" className="text-primary underline hover:text-primary/80">privacy@unipin.pk</a> or visit us at: <a href={`https://${domainUrl}/support`} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{domainUrl}/support</a></p>

          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Changes to This Privacy Policy</h2>
          <p>This privacy policy was last updated on January 1st, 2026.</p>
          <p>We may change our Product and policies, and we may need to make changes to this Privacy Policy so that they accurately reflect our Product and policies. Unless otherwise required by law, we will notify you (for example, through our Product) before we make changes to this Privacy Policy and give you an opportunity to review them before they go into effect. Then, if you continue to use the Product, you will be bound by the updated Privacy Policy. If you do not want to agree to this or any updated Privacy Policy, you can delete your account.</p>
        </div>
      </div>

      <LegalPageSections />

      {/* Footer */}
      <footer className="bg-topbar">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:gap-12 gap-8">
            <div className="flex flex-col items-center sm:items-start sm:w-1/4"><img src={unipinLogo} alt="UniPin" className="h-10 mb-4" /><p className="text-sm text-muted-foreground text-center sm:text-left">Universal Pin is the leading Digital Content Enabler that focus only on online games and digital products across the world.</p></div>
            <div className="flex flex-col items-center sm:items-start sm:w-1/4"><h3 className="font-bold text-foreground mb-3">Product & Service</h3><div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground"><span>Games</span><span>Voucher Purchase</span><span>SEACA eSports & Community</span><span>Payment Channels</span></div></div>
            <div className="flex flex-col items-center sm:items-start sm:w-1/4"><h3 className="font-bold text-foreground mb-3">Support & Information</h3><div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground"><span>UP Station Media</span><span>Promo & Events</span><span>FAQ</span><span>Customer Support</span></div></div>
            <div className="flex flex-col items-center sm:items-start sm:w-1/4"><h3 className="font-bold text-foreground mb-3">Corporate & Partnership</h3><div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground"><span>About Us</span><span>Partnership Program</span><span>UniPin Affiliates Program</span><span>Careers</span></div></div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-1">Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga</p>
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-1">Kementerian Perdagangan Republik Indonesia</p>
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-1">WhatsApp: <a href="https://wa.me/447476966269" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+44 747-6966269</a></p>
            <p className="text-xs text-muted-foreground text-center sm:text-left mb-4">To submit suggestions, complaints or concerns, consumers can contact: <a href="https://wa.me/447476966269" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+44 747-6966269</a></p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-muted-foreground text-center sm:text-left">© 2026 UniPin. All Rights Reserved</p>
              <div className="flex justify-center sm:justify-start gap-4 text-xs text-primary flex-wrap">
                <Link to="/terms-and-conditions" className="hover:underline">Website Terms and Conditions</Link>
                <Link to="/user-terms" className="hover:underline">User Terms & Conditions</Link>
                <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
              </div>
              <div className="flex justify-center sm:justify-end"><img src={activeFlagUrl} alt={activeCountryName} className="w-7 h-7 rounded-full object-cover border border-white/20" /></div>
            </div>
          </div>
        </div>
      </footer>

      <RegionSelector open={regionOpen} onOpenChange={setRegionOpen} selectedCountry={activeCountryCode} selectedLang={lang} onSelectCountry={(code, name) => setManualCountry({ code, name })} onSelectLang={setLang} localLangCode={localLangCode} />
    </div>
  );
};

export default PrivacyPolicy;
