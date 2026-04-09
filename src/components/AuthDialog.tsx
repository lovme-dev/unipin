import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import unipinLogo from "@/assets/unipin-logo.svg";
import loginHeroBg from "@/assets/login-hero-bg.png";
import iconInstant from "@/assets/icon-instant-signup.png";
import iconOffers from "@/assets/icon-exclusive-offers.png";
import iconPoints from "@/assets/icon-earn-points.png";
import AuthForm from "@/components/AuthForm";

const features = [
  {
    icon: iconInstant,
    title: "Instant Sign-Up, Instant Rewards",
    desc: "Just 3 quick steps to claim your exclusive welcome bonus!",
  },
  {
    icon: iconOffers,
    title: "Exclusive Offers & Rewards",
    desc: "Get access to special deals and rewards made just for true gamers!",
  },
  {
    icon: iconPoints,
    title: "Earn UC Points & Redeem Epic Loot",
    desc: "Top up, collect points, and exchange them for legendary rewards!",
  },
];

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[95vw] p-0 border-0 bg-transparent overflow-hidden gap-0 rounded-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Sign In or Register</DialogTitle>

        <div className="flex flex-row w-full">
          {/* Left Panel - Why Join UniPin */}
          <div
            className="relative w-[420px] shrink-0 overflow-hidden rounded-l-2xl"
          >
            <img src={loginHeroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />

            <div className="relative z-10 p-8">
              <img src={unipinLogo} alt="UniPin" className="h-7 mb-6" />

              <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                Why Join UniPin?
              </h2>
              <p className="text-white/90 text-sm mb-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                Sign up now and unlock insane rewards, epic deals, and non-stop gaming perks!
              </p>

              <div className="flex flex-col gap-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/60 backdrop-blur-sm"
                  >
                    <img src={f.icon} alt="" className="w-12 h-12 object-contain shrink-0" />
                    <div>
                      <h3 className="text-white font-bold text-sm">{f.title}</h3>
                      <p className="text-white/70 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1 bg-topbar rounded-r-2xl p-8 relative">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <AuthForm onSuccess={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
