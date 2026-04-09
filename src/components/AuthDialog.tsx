import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Eye, EyeOff } from "lucide-react";
import unipinLogo from "@/assets/unipin-logo.svg";
import iconInstant from "@/assets/icon-instant-signup.png";
import iconOffers from "@/assets/icon-exclusive-offers.png";
import iconPoints from "@/assets/icon-earn-points.png";

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
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[95vw] p-0 border-0 bg-transparent overflow-hidden gap-0 rounded-xl sm:rounded-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Sign In or Register</DialogTitle>

        {/* Mobile: full vertical layout, Desktop: side by side */}
        <div className="flex flex-col sm:flex-row w-full">
          {/* Left Panel - Why Join UniPin */}
          <div
            className="relative w-full sm:w-[420px] shrink-0 overflow-hidden rounded-t-xl sm:rounded-l-2xl sm:rounded-tr-none"
            style={{
              background: "linear-gradient(180deg, hsl(260, 60%, 55%) 0%, hsl(30, 90%, 55%) 100%)",
            }}
          >
            {/* Decorative overlay */}
            <div className="absolute inset-0 opacity-30" style={{
              background: "radial-gradient(circle at 80% 20%, hsl(45, 100%, 70%) 0%, transparent 50%), radial-gradient(circle at 20% 80%, hsl(330, 80%, 60%) 0%, transparent 50%)",
            }} />

            <div className="relative z-10 p-6 sm:p-8">
              <img src={unipinLogo} alt="UniPin" className="h-6 sm:h-7 mb-6" />

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Why Join UniPin?
              </h2>
              <p className="text-white/90 text-sm mb-6">
                Sign up now and unlock insane rewards, epic deals, and non-stop gaming perks!
              </p>

              <div className="flex flex-col gap-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "hsl(220, 30%, 18% / 0.6)", backdropFilter: "blur(8px)" }}
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

          {/* Right Panel - Sign In / Register Form */}
          <div className="flex-1 bg-topbar rounded-b-xl sm:rounded-r-2xl sm:rounded-bl-none p-6 sm:p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tabs */}
            <div className="flex gap-6 mb-8 mt-2">
              <button
                onClick={() => setTab("signin")}
                className={`pb-2 text-base font-semibold transition-colors border-b-2 ${
                  tab === "signin"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setTab("register")}
                className={`pb-2 text-base font-semibold transition-colors border-b-2 ${
                  tab === "register"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Register
              </button>
            </div>

            {/* Google Login Button */}
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-white font-semibold text-sm transition-colors"
              style={{ background: "#4285F4" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
              </svg>
              Google Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-xs">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {tab === "signin" ? (
              <>
                {/* Email */}
                <div className="mb-3">
                  <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
                    <span className="text-foreground text-sm font-semibold">Email</span>
                    <input
                      type="email"
                      placeholder="Email"
                      className="bg-transparent text-right text-muted-foreground text-sm outline-none w-1/2"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-2">
                  <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
                    <span className="text-foreground text-sm font-semibold">Password</span>
                    <div className="flex items-center gap-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="bg-transparent text-right text-muted-foreground text-sm outline-none w-32"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="text-right mb-6">
                  <button className="text-primary text-sm hover:underline">Forgot password?</button>
                </div>

                {/* Sign in button */}
                <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors">
                  Sign in
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <button onClick={() => setTab("register")} className="text-primary hover:underline font-medium">
                    Sign up now
                  </button>
                </p>
              </>
            ) : (
              <>
                {/* Username */}
                <div className="mb-3">
                  <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
                    <span className="text-foreground text-sm font-semibold">Username</span>
                    <input
                      type="text"
                      placeholder="Username"
                      className="bg-transparent text-right text-muted-foreground text-sm outline-none w-1/2"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
                    <span className="text-foreground text-sm font-semibold">Email</span>
                    <input
                      type="email"
                      placeholder="Email"
                      className="bg-transparent text-right text-muted-foreground text-sm outline-none w-1/2"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
                    <span className="text-foreground text-sm font-semibold">Password</span>
                    <div className="flex items-center gap-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="bg-transparent text-right text-muted-foreground text-sm outline-none w-32"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
                    <span className="text-foreground text-sm font-semibold">Confirm Password</span>
                    <div className="flex items-center gap-2">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm"
                        className="bg-transparent text-right text-muted-foreground text-sm outline-none w-32"
                      />
                      <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Register button */}
                <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors">
                  Register
                </button>

                {/* Sign in link */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <button onClick={() => setTab("signin")} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
