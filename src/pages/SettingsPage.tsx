import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import unipinLogo from "@/assets/unipin-logo.svg";
import EditProfilePage from "./EditProfilePage";
import ChangePasswordPage from "./ChangePasswordPage";
import DeleteAccountPage from "./DeleteAccountPage";
import ManageConsentPage from "./ManageConsentPage";

type SubPage = "edit-profile" | "change-password" | "change-pin" | "delete-account" | "manage-consent" | null;

const settingsItems = [
  { id: "edit-profile" as SubPage, title: "Edit Profile", desc: "General account settings" },
  { id: "change-password" as SubPage, title: "Change Password", desc: "Login Password" },
  { id: "change-pin" as SubPage, title: "Change Security PIN", desc: "You will be asked for your Security PIN when making purchases" },
  { id: "delete-account" as SubPage, title: "Delete Account", desc: "Permanently delete your account from UniPin site" },
  { id: "manage-consent" as SubPage, title: "Manage Consent", desc: "Manage My Website and Cookies Consent" },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [subPage, setSubPage] = useState<SubPage>(null);

  const renderSubPage = () => {
    switch (subPage) {
      case "edit-profile": return <EditProfilePage onBack={() => setSubPage(null)} />;
      case "change-password": return <ChangePasswordPage onBack={() => setSubPage(null)} />;
      case "delete-account": return <DeleteAccountPage onBack={() => setSubPage(null)} />;
      case "manage-consent": return <ManageConsentPage onBack={() => setSubPage(null)} />;
      default: return null;
    }
  };

  if (subPage && subPage !== "change-pin") {
    return renderSubPage();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
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

      {/* Settings Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Settings Items */}
      <div className="px-4">
        {settingsItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.id === "change-pin" ? null : setSubPage(item.id)}
            className="w-full flex items-center justify-between py-5 border-b border-border/30 text-left"
          >
            <div>
              <p className="text-base font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
