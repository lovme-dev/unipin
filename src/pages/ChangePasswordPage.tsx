import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import unipinLogo from "@/assets/unipin-logo.svg";

interface ChangePasswordPageProps {
  onBack: () => void;
}

const ChangePasswordPage = ({ onBack }: ChangePasswordPageProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = getStrength(newPassword);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully!");
      onBack();
    }
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

      <div className="px-4 py-4">
        <button onClick={onBack}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="px-4 text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Change Password</h1>
        <p className="text-sm text-muted-foreground mt-2">It's a good idea to use a strong and unique password</p>
      </div>

      <div className="px-4 space-y-6">
        <div>
          <label className="text-sm text-muted-foreground">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border/50 py-3 pr-10 text-foreground outline-none focus:border-primary"
            />
            <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-0 top-3 text-muted-foreground">
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border/50 py-3 pr-10 text-foreground outline-none focus:border-primary"
            />
            <button onClick={() => setShowNew(!showNew)} className="absolute right-0 top-3 text-muted-foreground">
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {newPassword && (
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? "bg-primary" : "bg-border/30"}`} />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Please Reenter New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border/50 py-3 pr-10 text-foreground outline-none focus:border-primary"
            />
            <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-3 text-muted-foreground">
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button onClick={onBack} className="flex-1 py-3 rounded-full border border-border/50 text-foreground font-medium">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-medium">
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
