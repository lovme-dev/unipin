import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import unipinLogo from "@/assets/unipin-logo.svg";
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

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section - Why Join UniPin */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(260, 60%, 55%) 0%, hsl(30, 90%, 55%) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(circle at 80% 20%, hsl(45, 100%, 70%) 0%, transparent 50%), radial-gradient(circle at 20% 80%, hsl(330, 80%, 60%) 0%, transparent 50%)",
        }} />

        <div className="relative z-10 px-4 pt-4 pb-6">
          {/* Back button + Logo */}
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => navigate(-1)} className="text-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img src={unipinLogo} alt="UniPin" className="h-5" />
          </div>

          <h2 className="text-xl font-bold text-white mb-1 text-center">
            Why Join UniPin?
          </h2>
          <p className="text-white/90 text-sm text-center mb-5">
            Sign up now and unlock insane rewards, epic deals, and non-stop gaming perks!
          </p>

          {/* Horizontal scrollable feature cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 p-3 rounded-xl bg-background/60 backdrop-blur-sm min-w-[300px] shrink-0"
                style={{ scrollSnapAlign: "start" }}
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

      {/* Form Section */}
      <div className="flex-1 bg-topbar rounded-t-2xl -mt-3 relative z-10 px-5 py-6">
        <AuthForm />
      </div>
    </div>
  );
};

export default LoginPage;
