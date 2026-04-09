import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import unipinLogo from "@/assets/unipin-logo.svg";

interface EditProfilePageProps {
  onBack: () => void;
}

const EditProfilePage = ({ onBack }: EditProfilePageProps) => {
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      }
    });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, contact_no: contactNo, date_of_birth: dob, gender }
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
      onBack();
    }
  };

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

      {/* Page Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={onBack}>
          <X className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
      </div>

      {/* Form */}
      <div className="px-4 space-y-6">
        <div>
          <label className="text-sm text-muted-foreground">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b border-border/50 py-3 text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Contact No.</label>
          <input
            type="tel"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            className="w-full bg-transparent border-b border-border/50 py-3 text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-transparent border-b border-border/50 py-3 text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">Gender</label>
          <div className="flex gap-4">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                gender === "male" ? "border-primary text-primary" : "border-border/50 text-foreground"
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                gender === "female" ? "border-primary text-primary" : "border-border/50 text-foreground"
              }`}
            >
              Female
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

export default EditProfilePage;
