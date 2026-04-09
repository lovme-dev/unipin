import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

interface AuthFormProps {
  onSwitchToSignIn?: () => void;
  onSwitchToRegister?: () => void;
  onSuccess?: () => void;
}

const AuthForm = ({ onSwitchToSignIn, onSwitchToRegister, onSuccess }: AuthFormProps) => {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  let navigate: ReturnType<typeof useNavigate> | null = null;
  try { navigate = useNavigate(); } catch { /* not in router */ }

  const handleTabSwitch = (newTab: "signin" | "register") => {
    setTab(newTab);
    if (newTab === "signin") onSwitchToSignIn?.();
    if (newTab === "register") onSwitchToRegister?.();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed. Please try again.");
        return;
      }
      if (result.redirected) return;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        onSuccess?.();
        navigate?.("/");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: username || undefined },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Registration successful! Please check your email to verify your account.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-6 mb-8 mt-2">
        <button
          onClick={() => handleTabSwitch("signin")}
          className={`pb-2 text-base font-semibold transition-colors border-b-2 ${
            tab === "signin"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => handleTabSwitch("register")}
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
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold text-sm transition-colors bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50"
      >
        <GoogleIcon />
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-xs">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {tab === "signin" ? (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
              <span className="text-foreground text-sm font-semibold">Email</span>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent text-right text-muted-foreground text-sm outline-none w-1/2" />
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
              <span className="text-foreground text-sm font-semibold">Password</span>
              <div className="flex items-center gap-2">
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent text-right text-muted-foreground text-sm outline-none w-32" />
                <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="text-right mb-6">
            <button className="text-primary text-sm hover:underline">Forgot password?</button>
          </div>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <button onClick={() => handleTabSwitch("register")} className="text-primary hover:underline font-medium">Sign up now</button>
          </p>
        </>
      ) : (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
              <span className="text-foreground text-sm font-semibold">Username</span>
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="bg-transparent text-right text-muted-foreground text-sm outline-none w-1/2" />
            </div>
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
              <span className="text-foreground text-sm font-semibold">Email</span>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent text-right text-muted-foreground text-sm outline-none w-1/2" />
            </div>
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
              <span className="text-foreground text-sm font-semibold">Password</span>
              <div className="flex items-center gap-2">
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent text-right text-muted-foreground text-sm outline-none w-32" />
                <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between bg-[hsl(220,20%,16%)] rounded-lg px-4 py-3">
              <span className="text-foreground text-sm font-semibold">Confirm Password</span>
              <div className="flex items-center gap-2">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-transparent text-right text-muted-foreground text-sm outline-none w-32" />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-muted-foreground hover:text-foreground">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <button onClick={() => handleTabSwitch("signin")} className="text-primary hover:underline font-medium">Sign in</button>
          </p>
        </>
      )}
    </>
  );
};

export { AuthForm, GoogleIcon };
export default AuthForm;
