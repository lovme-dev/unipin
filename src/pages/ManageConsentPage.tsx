import { X } from "lucide-react";
import { Link } from "react-router-dom";
import unipinLogo from "@/assets/unipin-logo.svg";

interface ManageConsentPageProps {
  onBack: () => void;
}

const ManageConsentPage = ({ onBack }: ManageConsentPageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, hsl(var(--header-glow) / 0.67) 0%, hsl(var(--header-glow) / 0.32) 45%, transparent 100%)',
        }} />
        <div className="relative z-20 py-1.5 px-3">
          <span className="font-bold tracking-wide text-[10px]">INSTANT TOP UP! INSTANT PLAY!</span>
        </div>
        <div className="relative z-10 px-3 py-2">
          <img src={unipinLogo} alt="UniPin" className="h-5" />
        </div>
      </div>

      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={onBack}>
          <X className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Manage Consent</h1>
      </div>

      <div className="px-4">
        {/* Website Consent */}
        <h2 className="text-2xl font-bold text-foreground mt-4 mb-3">Website Consent</h2>
        <Link to="/privacy-policy" className="text-primary text-sm block mb-2 hover:underline">Privacy Policy</Link>
        <Link to="/user-terms" className="text-primary text-sm block mb-4 hover:underline">User Terms and Conditions</Link>
        <button className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm">
          Withdraw Website Consent
        </button>

        <div className="border-t border-border/30 my-6" />

        {/* Cookies Consent */}
        <h2 className="text-2xl font-bold text-foreground mb-3">Cookies Consent</h2>
        <button className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm">
          Manage Cookies Consent
        </button>
      </div>
    </div>
  );
};

export default ManageConsentPage;
