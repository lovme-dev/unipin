import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ChevronDown } from "lucide-react";
import { useGeo } from "@/hooks/use-geo";
import RegionSelector, { getLanguageCode } from "@/components/RegionSelector";
import { getTranslations } from "@/i18n/translations";
import unipinLogo from "@/assets/unipin-logo.svg";
import LegalPageSections from "@/components/LegalPageSections";

const UserTerms = () => {
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
  const t = getTranslations(activeLangCode);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.title = "User Terms & Conditions | UniPin - Product Usage Policy";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "UniPin user terms and conditions for product usage, payments, refund policy, account termination, intellectual property, and UniPin credits and rewards program.");
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
          <span className="font-bold tracking-wide">{t.instantTopUp}</span>
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
            <button className="bg-primary text-primary-foreground px-4 py-1 rounded-md text-xs font-bold tracking-wide">{t.signIn}</button>
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

      {/* User Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{t.userTermsTitle}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t.updatedAt} 2026-01-01</p>
        <div className="border-t border-border mb-8" />

        <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <p>
            This web page represents our Terms and Conditions on the Use of UniPin ("Terms"), located at {domainUrl} and the tools provided by UniPin and/or its affiliates and governs all products offered by UniPin as particularly described below ("Products"). These Terms and Conditions apply to your use of all of UniPin Products and website. You acknowledge that you are aware of the contents of and agree to be legally bound by these Terms and Conditions. The terms, "we" and "our" as used in this Term refer to UniPin. Our Product permit you to make purchases at our Website using your mobile account or payment channels.
          </p>

          <p>
            We may amend these Terms at any time by posting the amended terms on our Website. We may or may not post notices on the homepage of our Website when such changes occur. By accessing, using and making purchases using our Product, you are agreeing to these Terms.
          </p>

          <p>
            UniPin reserves the right to refuse to provide the Product to anyone for any reason at any time. Your use of the Product and/or website is at your sole risk. In circumstances where you are authorized both to make purchases for the organization, you may make purchases using a corporate or business mobile account or payment instrument and shall agree to these Terms on its behalf.
          </p>

          <p>
            You expressly understand and agree that UniPin shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, or damages for loss of profits, goodwill, use, data or other intangible losses resulting from the use of or inability to use the Product and/or website.
          </p>

          <p>
            In no event shall UniPin or our merchants be liable for lost profits or any special, incidental or consequential damages arising out of or in connection with our website, our Product or these Terms (however arising including negligence). You agree to indemnify and hold us and (as applicable) our parent, subsidiaries, affiliates, officers, directors, agents, and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your breach of these Terms or the documents it incorporates by reference, or your violation of any law or the rights of a third party or your use of the Product and/or our website.
          </p>

          <p>
            The Product may provide, or third parties may provide, links to other World Wide Web (www) sites or resources. Because UniPin has no control over such websites and resources, you acknowledge and accept that UniPin is not responsible for the availability of such external websites or resources, and does not endorse and is not responsible or liable for any information, data, text, software, music, sound, photographs, graphics, video, messages, tags, or other materials ("Content"), advertising, products or other materials on or available from such websites or resources. As such, you also acknowledge and accept that UniPin does not and is not obligated to examine, evaluate or screen any of these external resources and does not warrant or endorse any of the information, content, offers or claims of these third parties. You further acknowledge and agree that UniPin shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such Content, goods available on or through any such website or resource.
          </p>

          <p>
            You agree not to alter, modify, reproduce, duplicate, copy, sell, resell or exploit any portion of the Product, use of the Product, or access to the Product without the express written permission by UniPin.
          </p>

          <p>
            The entire content of this website which consists of inter alia text, video (of any format, streaming or otherwise), audio clips (of any format, streaming or otherwise), data assemblages, graphics, logos, buttons, icons and any software (the "Site Content") is proprietary to UniPin or its content provider or other third parties and is protected under international and domestic copyright laws. The arrangement and/or compilation of the Website Content is proprietary to UniPin and is protected under international and domestic copyright laws.
          </p>

          <p>
            Verbal or written abuse of any kind (including but not limited to threats of abuse or retribution and defamatory statements) of any UniPin's customer, employee, member, or officer will result in immediate account termination.
          </p>

          <p>
            The failure of UniPin to exercise or enforce any right or provision of the Terms and Conditions shall not constitute a waiver of such right or provision.
          </p>

          {/* Using our Product */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Using our Product, you agree that:</h2>

          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Transactions made via UniPin cannot be refuted once initiated.</li>
            <li>You are solely responsible in the usage of your mobile account or payment channel and that UniPin shall have no liability to you or any third party for any unauthorized use or access of UniPin through your mobile account or payment channels or in the event your mobile account or your account has been compromised. In such circumstances, it is your responsibility to inform your mobile operator or your payment channel of such instances.</li>
            <li>Any taxes, duties, currency exchange fees, data charges and any other applicable charges in relation to your purchases via UniPin shall be borne by you.</li>
            <li>UniPin, or your mobile operator if made purchase via your mobile account or your chosen payment channel provided at {domainUrl} has the sole discretion to accept or decline a transaction performed by you through UniPin for whatsoever reason, and that, should this occur, UniPin shall not be held liable to you.</li>
            <li>You have consented to be contacted by UniPin, and to receive notices electronically, including but not limited to by text message, from us. You agree that we may make any notices that we may be required by law to make in electronic format. These communications will be deemed to be in writing and received by you when sent to you.</li>
            <li>You may be required to register with the Website. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</li>
          </ul>

          {/* As a user */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">As a user of our Product, you agree not to:</h2>

          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Use the Product in any way that violates any applicable law or for any unlawful purpose.</li>
            <li>Disparage, tarnish, or otherwise harm, UniPin, our websites, or our Product.</li>
            <li>Make any unauthorized use or access of the Product, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretences.</li>
            <li>Use a buying agent or purchasing agent to make purchases using our Products and thereafter charge others directly or indirectly for such uses.</li>
            <li>Attempt to impersonate another user or person or use the username of another user.</li>
            <li>Use any information obtained from the Website in order to harass, abuse, or harm another person.</li>
            <li>Systematically retrieve data or other content from the Website to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Website, including features that prevent or restrict the use or copying of any content or enforce limitations on the use of the Website and/or the content contained therein.</li>
            <li>Engage in unauthorized framing of or linking to the Website/Product.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
            <li>Interfere with, disrupt, or create an undue burden on the Website or the networks or Product connected to the Website.</li>
            <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Website.</li>
            <li>Attempt to bypass any measures of the Website designed to prevent or restrict access to the Website, or any portion of the Website.</li>
            <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Product to you.</li>
          </ul>

          <p>
            UniPin reserves the right to deny payments from suspicious buyers. In the event that an order or payment is tagged as being suspicious, delivery of item(s) will be delayed until UniPin can successfully verify its legitimacy, be it by phone or a request for verifying information. The determination of what amounts to suspiciousness shall be at the sole and absolute discretion of UniPin. You acknowledge and accept that under the laws of certain jurisdictions, UniPin may be obligated to report any suspicious transactions to the relevant authorities.
          </p>

          <p>
            Unless you notify UniPin to the contrary on the day of delivery and such notification is confirmed by email, the Product shall be deemed to have been accepted by you as being in good order and in accordance with the terms and conditions under which the Product is offered by UniPin.
          </p>

          <p>
            You undertake to make all payments promptly and in accordance with any rules, regulations or guidelines issued by UniPin from time to time and shall not be entitled to withhold payment of all or any of the price.
          </p>

          <p>
            All transactions made in accordance with these Terms and Conditions are final. The Product that has been delivered is strictly non-refundable.
          </p>

          <p>
            If you have any complaints about our website and/or Product, you should direct them to us via e-mail at cs@unipin.pk.
          </p>

          {/* UniPin Products */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">UniPin Products</h2>

          <ul className="list-disc list-inside space-y-3 pl-2">
            <li>UniPin Credits are not legal tender. They are virtual credits which allow users to reload and spend on any online and mobile games available at {domainUrl} and UniPin content partners payment platform.</li>
            <li>UniPin voucher is a game voucher which carries UniPin Credits in the form of a physical voucher or softpin. Each UniPin voucher comprises a unique serial number and pin code which allow users to reload UniPin Credits into their UniPin account or perform flash top up into games which is available at {domainUrl} and UniPin content partners payment platform.</li>
            <li>UniPin Reward Program Membership ("Program") implemented and operated by PT. 24 Jam Online. Under the Program, if you have signed up for the Program as a UniPin Reward member ("Coin"), we allow you to collect Coin through the purchase of UniPin Credits at {domainUrl} portal website and to use the Coin you have collected to redeem UniPin Credits, merchandise, gift certificates and other rewards ("Reward") that is provided by suppliers, manufacturers, retailers, and content providers ("Partners") being offered by us from time to time.</li>
            <li>Registration, membership, and all benefits will be subjected to the Terms and Conditions of the specific Program. By registering in the Program or Coin collection, you agree that you have read and understood the Terms & Conditions and are bound by all the Terms & Conditions, that may be subjected to change from time to time, and also agree for us to collect and use your personal information in accordance with our Privacy Policy. The Terms & Conditions herein is between us and you and relate to your participation in the Program, your right to collect, use, redeem the Reward and your right to other benefits of the Program. If you are dealing with us in regards to the internet, you hereby allow the forming of a contractual agreement through electronic communication. We have the final authority in the interpretation of the Terms & Conditions and other related questions in relation to the Program or the Reward. Our failure to carry out any of the provisions of the Terms & Conditions at any time may not be interpreted as a relinquishment of rights or the rights of all parties to conduct violations over any provision or any other provision of this Terms & Conditions. You may not divert or transfer your rights or obligations under the Terms & Conditions without prior written permission from us.</li>
          </ul>

          {/* Participation */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">Participation in the Program</h2>

          <h3 className="text-base font-semibold text-foreground pt-2">PIN (Personal Identification Number)</h3>

          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>UniPin membership only applies to individuals, not to companies, organizations or any other body.</li>
            <li>To register in the Program, you must (i) register or sign up to acquire a UniPin account ("Account"), (ii) inform us of your mailing address and a valid email address, and (iii) be at least 18 (eighteen) years old and if you are under the age of 18 (or equivalent minimum age in the relevant jurisdiction), we require you to obtain permission from your legal guardian to register for an account and that the legal guardian must agree to these Terms and Conditions. If you are the legal guardian of a minor who is registering for an Account, you must accept these Terms and Conditions on the minor's behalf and you will be responsible for all use of the Account, including any transactions made by the minor, whether the minor's account is now open or created later and whether or not the minor is supervised by you during his or her use of our Product.</li>
            <li>If we accept your registration application, we will sign you up in the Program as a UniPin Reward Program member ("Member"), you must provide any change to your personal data to us, such as name, mailing address, email address, and phone number by contacting our Customer Support at cs@unipin.pk or you may renew your personal data through {domainUrl} ("Member Web Portal").</li>
            <li>In the event your account is lost and you forgot your email and access code, you will lose all of your Coin.</li>
            <li>UniPin reserves the right to terminate your membership at any time for whatsoever reason UniPin deems fit.</li>
            <li>Email is required to access the Member Account and to redeem your Coin, or when contacting Customer Support at cs@unipin.pk.</li>
            <li>You are responsible for ensuring that you keep your email confidential at all times and to notify us over any illegal use of your email or when your email is compromised.</li>
            <li>We are not responsible or accountable in any way over losses arising from your failure to fulfil these conditions.</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground pt-2">Coin Acquisition</h3>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Coin are acquired for every purchase of UniPin Credits made by using the payment channels provided at {domainUrl} website.</li>
            <li>To acquire Coin you must perform a transaction purchase at {domainUrl}.</li>
            <li>Coin will then be automatically added to your UniPin membership Account no later than 24 hours after the transaction has been initiated.</li>
            <li>You will acquire UniPin Coin for every transaction that is performed at UniPin with the term of 0.01% of the transaction value. Further UniPin reserves the right to change the provision at any time.</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground pt-2">Coin Expiration</h3>
          <p>Coin expires 12 months after the date it is acquired.</p>

          <h3 className="text-base font-semibold text-foreground pt-2">Coin Usage</h3>
          <p>
            Coin does not have any cash value, monetary value, or other values, and cannot be converted to any currency. Coin are calculated according to the Reward Program that we provide from time to time. UniPin reserves the right to set the amount of Coin required to redeem or convert into any goods or benefits that will be exchanged and to alter the amount at any time, without prior notice.
          </p>

          {/* INTELLECTUAL PROPERTY */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">INTELLECTUAL PROPERTY RIGHTS</h2>

          <p>
            If you purchase any digital content from the website, it is exclusively for your personal consumption. You have no right to reproduce it for any reason. Except for the licenses granted in these Terms and Conditions, you have no right, title or interest in or to UniPin or its Product. The content and information of this website is protected by intellectual property rights law and owned by UniPin and/or the proprietary property of its suppliers, affiliates, or licensors. Without UniPin's prior written permission, you may not copy, reproduce, publish, distribute, transmit, display, license, sell, circulate, create derivative works from, or otherwise exploit the content and information of this website to any third party (including, without limitation, the display and distribution of the material via a third party website or other networked computer environment).
          </p>

          <p>
            Unauthorized use of this website, including without limitation, unauthorized entry into the UniPin systems, misuse of passwords or misuse of any information posted on the website is strictly prohibited. In addition, use of this website is unauthorized in any jurisdiction where the use of this website may violate any applicable legal requirements.
          </p>

          <p>
            All trademarks, product marks, trade names, logos and icons (collectively "Trademarks") displayed on our website are registered and unregistered Trademarks of UniPin and others. Nothing contained in our website should be construed as granting, by implication, estoppel, or otherwise, any licence or right to use any Trademark displayed on our website without the written permission of UniPin or such third party that may own the Trademarks displayed on our website. Your use of the Trademarks displayed on our website, or any other content on our website, is strictly prohibited.
          </p>

          {/* DISCLAIMER OF WARRANTIES */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">DISCLAIMER OF WARRANTIES</h2>

          <p className="uppercase text-xs sm:text-sm">
            UNIPIN DOES NOT GUARANTEE, REPRESENT, OR WARRANT THAT YOUR USE OF THE PRODUCT AND/OR WEBSITE WILL BE UNINTERRUPTED OR ERROR-FREE, AND YOU AGREE THAT FROM TIME TO TIME WE MAY REMOVE THE PRODUCT FOR INDEFINITE PERIODS OF TIME, OR CANCEL THE PRODUCT IN ACCORDANCE WITH THESE TERMS AND CONDITIONS.
          </p>

          <p>
            We have no control over the quality, fitness, safety, reliability, legality, or any other aspect of any Product that is purchased using our Product. We are not required to issue refunds if a purchase turns out to not meet your expectations, or if the third party providers do not fulfil their commitments, although we will make reasonable efforts to assist you in these matters. We have no obligation, and cannot guarantee that, we will resolve any disputes related to any transaction to your satisfaction.
          </p>

          <p>
            We have the absolute discretion to alter the Terms & Conditions, in any way in respect of the Program, including terms of ordering, Coin usage procedures for Reward, or Reward in any form, without prior notice, and even if the changes can affect the value of the accumulated Coin. You must check our present Terms & Conditions and details and other information for the Program through the Member Web Portal or by calling our Customer Support at cs@unipin.pk.
          </p>

          <p>
            Our website content is provided based on "as is" and "as available". We hereby firmly state that we do not make any guarantees or collaterals whether expressly or implicitly, in respect to the merchantability of a product or suitability of our product that we provide for a specific purpose.
          </p>

          <p>
            From time to time, our Product may be delayed, interrupted or disrupted for an indeterminate period of time. In addition, except as otherwise required by applicable law or regulation, UniPin may terminate your use of Product or impose limits on the type and/or amount of transactions you are allowed to make with the Product at any time at its sole discretion without prior notice. UniPin and its affiliates shall not be liable for any claim arising from or related to UniPin arising from any such delay, interruption, disruption, limitation, or suspension.
          </p>

          {/* LIMITATION OF LIABILITY */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">LIMITATION OF LIABILITY</h2>

          <p className="uppercase text-xs sm:text-sm">
            YOU EXPRESSLY UNDERSTAND AND AGREE THAT TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE AND OUR AFFILIATES (AND OUR AND THEIR RESPECTIVE EMPLOYEES, DIRECTORS, AGENTS AND REPRESENTATIVES), PARTNERS AND LICENSORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA COST OF PROCUREMENT OF SUBSTITUTE PRODUCTS, OR OTHER INTANGIBLE LOSSES ARISING OUT OF OR IN CONNECTION WITH: (i) THE USE OR INABILITY TO USE THE PRODUCT; (ii) ANY CHANGES MADE TO THE PRODUCT OR ANY TEMPORARY OR PERMANENT CESSATION OF THE PRODUCT OR ANY PART THEREOF; (iii) THE UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; (iv) THE DELETION OF, CORRUPTION OF, OR FAILURE TO STORE AND/OR SEND OR RECEIVE YOUR TRANSMISSIONS OR DATA ON OR THROUGH THE PRODUCT; (v) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE PRODUCT; (vi) PROGRAM OR YOUR PARTICIPATION IN THE PROGRAM, (vii) DELAY, FAILURE OR DECISION BY US IN THE OPERATION OF THE PROGRAM OR ANY CHANGES TO THE TERMS AND CONDITIONS ON THE REDEMPTION AND USAGE OF THE POINTS (viii) ILLEGITIMATE USE OF YOUR MEMBER CARD OR PIN, (ix) OFFERS, DESCRIPTION, STATEMENTS OR CLAIMS ABOUT THE PROGRAM, BRANDS OR PARTNERSHIP OR ANY INDIVIDUAL, (x) PURCHASES, REDEMPTIONS OR USAGE OF GOODS FROM THE BRAND OR PARTNERSHIP, INCLUDING OTHER REWARD, WHETHER PROVIDED BY US OR ONE OF OUR AFFILIATES, BRAND OR PARTNER. OUR BRAND AND PARTNERS ARE NOT ACCOUNTABLE FOR THE PROGRAM AND (xi) ANY OTHER MATTER RELATING TO THE PRODUCT AND/OR WEBSITE.
          </p>

          <p className="uppercase text-xs sm:text-sm">
            TO THE EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL THE AGGREGATE LIABILITY OF UNIPIN OR OUR AFFILIATES (AND OUR AND THEIR RESPECTIVE EMPLOYEES, DIRECTORS, AGENTS AND REPRESENTATIVES), PARTNERS AND LICENSORS ARISING OUT OF OR IN CONNECTION WITH THESE TERMS AND CONDITIONS OR THE TRANSACTIONS CONTEMPLATED HEREBY, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE, PRODUCT LIABILITY OR OTHER THEORY), WARRANTY, OR OTHERWISE, EXCEED THE AMOUNT OF FEES EARNED BY US IN CONNECTION WITH YOUR USE OF PRODUCT AND/OR WEBSITE DURING THE THREE (3) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM FOR LIABILITY.
          </p>

          {/* NO REFUND POLICY */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">NO REFUND POLICY</h2>

          <p>
            UniPin digital Products have a strict no-refund policy. Please be sure the products are right for you before purchasing. Users are solely responsible for confirming that their devices are compatible with the Products they purchase. All virtual items purchased are final, non-refundable and non-returnable. We do not offer refunds or exchanges for the incorrect purchase of UniPin Products, including due to compatibility issues.
          </p>

          {/* TERMINATION */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">TERMINATION</h2>

          <p>
            UniPin may at any time, under certain circumstances and without prior notice, immediately terminate or suspend all or a portion of your Account and/or access to the Product. Cause for such termination shall include: (a) violations of this Agreement or any other policies or guidelines that are referenced herein and/or posted on the Product; (b) a request by you to cancel or terminate your Account; (c) a request and/or order from law enforcement, a judicial body, or other government agency; (d) where provision of the Product to you is or may become unlawful; (e) unexpected technical or security issues or problems; (f) your participation in fraudulent or illegal activities; or (g) failure to pay any fees owed by you in relation to the Product, provided that in the case of non-material breach, UniPin will be permitted to terminate only after giving you 30 days' notice and only if you have not cured the breach within such 30-day period. Any such termination or suspension shall be made by UniPin in its sole discretion and UniPin will not be responsible to you or any third party for any damages that may result or arise out of such termination or suspension of your Account and/or access to the Product.
          </p>

          <p>
            In addition, UniPin may terminate your Account upon 30 days' prior notice via email to the address associated with your Account if (a) your Account has been inactive for one (1) year; or (b) there is a general discontinuance of the Product or any part thereof. Notice of general discontinuance of Product will be provided as set forth herein, unless it would not be reasonable to do so due to circumstances arising from legal, regulatory, or governmental action; to address user security, user privacy, or technical integrity concerns; to avoid disruptions to other users; or due to a natural disaster, a catastrophic event, war, or other similar occurrence outside of UniPin's reasonable control.
          </p>

          <p>
            Should you breach any of these Terms and Conditions, UniPin shall have the exclusive sole and absolute right to terminate, discontinue or withdraw the provision of the Product to you. In the event of a breach by you, UniPin reserves its right to pursue any remedy or relief in so far as permitted by law, which includes but is not limited to injunction, damages and/or specific performance.
          </p>

          {/* PRIVACY POLICY */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">PRIVACY POLICY</h2>

          <p>
            Please refer to our <Link to="/privacy-policy" className="text-primary hover:underline">privacy policy</Link>.
          </p>

          {/* MISCELLANEOUS */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground pt-4">MISCELLANEOUS</h2>

          <p>
            UniPin is not a bank, e-money issuer, or money transferor and does not require the approval of the relevant Authorities to operate. Your prepaid or post-paid mobile account is not a bank account, e-money account, payment card, or other regulated financial instrument. UniPin does not process or store your credit or debit card number. This Agreement shall be governed by and construed according to the laws of Malaysia without regard to its conflicts-of-law provisions, and you and UniPin agree to submit to the exclusive jurisdiction of the Malaysia courts. Nothing in these Terms and Conditions is intended to or creates any type of joint venture, employee-employer, creditor-debtor, escrow, partnership, or any fiduciary relationship between you, us, or our affiliates. UniPin may assign this Agreement, any of its terms, and any of UniPin obligations, in whole or in part, at any time, with or without notice to you, but you may not assign this Agreement, or any part of it, to any other party without UniPin's prior written approval. Any attempt by you to do so is void.
          </p>

          <p>
            Notwithstanding any law, rule or regulation to the contrary, you agree that any claim or cause of action you may have arising out of these Terms and Conditions must be filed within one (1) year after such claim or cause of action first could be filed or be forever barred. We will not be considered to have waived any of our rights or remedies, or portion of them, unless the waiver is in writing and signed by us. Our failure to enforce the strict performance of any provision of these Terms and Conditions will not constitute a waiver of our right to subsequently enforce such provision or any other provisions.
          </p>

          <p>
            These Terms and Conditions constitute the entire agreement between you and UniPin, and supersede and cancel all prior and contemporaneous agreements, claims, representations, and understandings (including, but not limited to, any prior versions of the Terms and Conditions). No modification or amendment of this Agreement will be binding on UniPin unless set forth in writing signed by us.
          </p>

          <p>
            If any part of this Agreement is held by a court of competent jurisdiction to be invalid or unenforceable, the remaining terms and conditions of this Agreement will remain in full force and effect and, upon our request, the court will construe any invalid or unenforceable portions in a manner that most closely reflects the economic, legal and business objectives of the original language. If such construction is not possible, the provision will be severed from this Agreement and the rest of the Agreement will remain in full force and effect.
          </p>

          <p>
            These Terms and Conditions were written in English. To the extent any translated version of this Agreement conflicts with the English version, the English version controls and prevails. We reserve the right to change, modify or otherwise alter these Terms and Conditions at any time. You can find the most recent version on our website. Such modifications shall become effective immediately upon the posting thereof.
          </p>
        </div>
      </div>

      <LegalPageSections />

      {/* Footer */}
      <footer className="bg-topbar">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:gap-12 gap-8">
            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <img src={unipinLogo} alt="UniPin" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Universal Pin is the leading Digital Content Enabler that focus only on online games and digital products across the world.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <h3 className="font-bold text-foreground mb-3">Product & Service</h3>
              <div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground">
                <span>Games</span>
                <span>Voucher Purchase</span>
                <span>SEACA eSports & Community</span>
                <span>Payment Channels</span>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <h3 className="font-bold text-foreground mb-3">Support & Information</h3>
              <div className="flex flex-col items-center sm:items-start gap-1.5 text-sm text-muted-foreground">
                <span>UP Station Media</span>
                <span>Promo & Events</span>
                <span>FAQ</span>
                <span>Customer Support</span>
              </div>
            </div>

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
                <Link to="/terms-and-conditions" className="hover:underline">{t.websiteTerms}</Link>
                <Link to="/user-terms" className="hover:underline">{t.userTermsConditions}</Link>
                <Link to="/privacy-policy" className="hover:underline">{t.privacyPolicyLink}</Link>
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

export default UserTerms;
