import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import unipinLogo from "@/assets/unipin-logo.svg";

interface DeleteAccountPageProps {
  onBack: () => void;
}

const DeleteAccountPage = ({ onBack }: DeleteAccountPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || "");
        setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      }
    });
  }, []);

  const handleRequestCode = () => {
    toast.info("Verification code sent to your email");
  };

  const handleConfirm = () => {
    toast.error("Account deletion is not available at this time");
  };

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
        <h1 className="text-xl font-bold text-foreground">Delete Account</h1>
      </div>

      <div className="px-4 space-y-6">
        <div>
          <label className="text-sm text-muted-foreground">Name</label>
          <input
            type="text"
            value={name}
            readOnly
            className="w-full bg-transparent border-b border-border/50 py-3 text-foreground outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full bg-transparent border-b border-border/50 py-3 text-foreground outline-none"
          />
        </div>

        <button onClick={handleRequestCode} className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium">
          Request Code
        </button>

        <div className="flex gap-4 pt-2">
          <button onClick={onBack} className="flex-1 py-3 rounded-full border border-border/50 text-foreground font-medium">
            Cancel
          </button>
          <button onClick={handleConfirm} className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-medium">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
