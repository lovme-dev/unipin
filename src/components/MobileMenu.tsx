import { X, Gamepad2, Percent, HelpCircle, Headphones, Handshake, Users, Trophy, Hash } from "lucide-react";
import unipinLogo from "@/assets/unipin-logo.svg";
import type { Translations } from "@/i18n/translations";
import { useState } from "react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
}

const MobileMenu = ({ open, onClose, t }: MobileMenuProps) => {
  const [activeItem, setActiveItem] = useState<string | null>("game");

  if (!open) return null;

  const section1 = [
    { key: "game", icon: Gamepad2, label: t.game },
    { key: "promo", icon: Percent, label: t.promotionsAndEvents },
  ];

  const section2 = [
    { key: "faq", icon: HelpCircle, label: t.faq },
    { key: "support", icon: Headphones, label: t.customerSupport },
  ];

  const section3 = [
    { key: "partnership", icon: Handshake, label: t.partnershipProgram },
    { key: "reseller", icon: Users, label: t.resellerProgram },
    { key: "seaca", icon: Trophy, label: t.seacaEsports },
  ];

  const renderItem = (item: { key: string; icon: React.ElementType; label: string }) => {
    const isActive = activeItem === item.key;
    const Icon = item.icon;
    return (
      <button
        key={item.key}
        onClick={() => setActiveItem(item.key)}
        className="flex items-center gap-4 py-3.5 px-2 w-full text-left rounded-lg transition-all duration-200 relative group"
      >
        {/* Active glow background */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: "linear-gradient(90deg, hsl(var(--primary) / 0.15) 0%, transparent 100%)",
            }}
          />
        )}
        <Icon
          className={`w-5 h-5 relative z-10 transition-colors ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <span
          className={`text-[15px] font-medium relative z-10 transition-colors ${
            isActive ? "text-primary" : "text-foreground"
          }`}
        >
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Menu Panel */}
      <div
        className="w-[72%] max-w-[320px] h-full overflow-y-auto flex flex-col"
        style={{
          background: "linear-gradient(180deg, hsl(220 25% 12% / 0.97) 0%, hsl(220 25% 10% / 0.98) 100%)",
          backdropFilter: "blur(40px) saturate(150%)",
          WebkitBackdropFilter: "blur(40px) saturate(150%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-8">
          <img src={unipinLogo} alt="UniPin" className="h-8" />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Section 1 */}
        <div className="px-4">
          {section1.map(renderItem)}
        </div>

        {/* Divider */}
        <div className="mx-5 my-3 border-t border-white/10" />

        {/* Section 2 */}
        <div className="px-4">
          {section2.map(renderItem)}
        </div>

        {/* Divider */}
        <div className="mx-5 my-3 border-t border-white/10" />

        {/* Section 3 */}
        <div className="px-4">
          {section3.map(renderItem)}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="flex-1"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />
    </div>
  );
};

export default MobileMenu;
