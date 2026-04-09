import { User, LogOut, ClipboardList, UserPen } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ProfileSheetProps {
  open: boolean;
  onClose: () => void;
  user: SupabaseUser;
  onLogout: () => void;
}

const ProfileSheet = ({ open, onClose, user, onLogout }: ProfileSheetProps) => {
  const navigate = useNavigate();
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const email = user.email || "";
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || email;

  if (!open) return null;

  const handleEditProfile = () => {
    onClose();
    navigate("/settings");
  };

  const handleTransactionHistory = () => {
    onClose();
    navigate("/transaction-history");
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[70] bg-black/50" onClick={onClose} />

      {/* Sheet - slides up from bottom to header */}
      <div
        className="fixed left-0 right-0 bottom-0 z-[71] flex flex-col animate-in slide-in-from-bottom duration-300"
        style={{ top: '0px' }}
      >
        {/* Tap to close area at top */}
        <div className="flex-shrink-0" style={{ height: '88px' }} onClick={onClose} />

        {/* Profile content */}
        <div className="flex-1 rounded-t-2xl overflow-y-auto" style={{ background: 'linear-gradient(180deg, hsl(30, 90%, 50%) 0%, hsl(25, 85%, 42%) 35%, hsl(220, 40%, 13%) 35%)' }}>
          {/* Orange header area */}
          <div className="px-5 pt-6 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-white/20">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate max-w-[200px]">{email}</span>
                </div>
              </div>
              <button onClick={onLogout} className="text-white/80 hover:text-white">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Credits card */}
          <div className="px-5 -mt-4">
            <div className="rounded-xl p-4" style={{ background: 'hsl(220, 40%, 18%)', border: '1px solid hsl(220, 30%, 25%)' }}>
              <p className="text-sm text-muted-foreground mb-1">UniPin Credits / UC (PKR)</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">0</span>
                <button onClick={() => { onClose(); navigate("/reload"); }} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  TOP UP
                </button>
              </div>
              <button className="text-primary text-sm mt-2 hover:underline">
                Reward Points ›
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="px-5 mt-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Features</h3>
            <div className="flex gap-8">
              <button onClick={handleEditProfile} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'hsl(220, 40%, 18%)', border: '1px solid hsl(220, 30%, 25%)' }}>
                  <UserPen className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-foreground">Edit Profile</span>
              </button>
              <button onClick={handleTransactionHistory} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'hsl(220, 40%, 18%)', border: '1px solid hsl(220, 30%, 25%)' }}>
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-foreground">Transaction History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSheet;
