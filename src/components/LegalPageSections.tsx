import { Mail, HelpCircle } from "lucide-react";

const supportItems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="0">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.434 5.503 3.678 7.2V22l3.378-1.852c.9.25 1.855.384 2.944.384 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.065 12.439-2.55-2.722L5.5 14.439l5.5-5.878 2.613 2.722L18.5 8.561l-5.435 5.878z"/>
      </svg>
    ),
    label: "Messenger",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.016a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/>
      </svg>
    ),
    label: "Whatsapp",
  },
  {
    icon: <Mail className="w-7 h-7" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />,
    label: "Email",
  },
  {
    icon: <HelpCircle className="w-7 h-7" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" />,
    label: "FAQ",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="0">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
        <path d="M8 10h.01M12 10h.01M16 10h.01" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "Give Feedback",
  },
];

const LegalPageSections = () => (
  <>
    {/* Customer Support */}
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Customer Support</h2>
      <p className="text-sm text-muted-foreground mb-6">Reach Us At</p>
      <div className="flex flex-wrap gap-3">
        {supportItems.map(({ icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center gap-2 w-[100px] sm:w-[130px] h-[90px] sm:h-[100px] rounded-lg border border-primary/40 bg-primary/[0.07] hover:bg-primary/[0.12] transition-colors"
          >
            <span className="text-primary">{icon}</span>
            <span className="text-xs sm:text-sm text-primary font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Subscribe */}
    <div className="mx-4 sm:mx-8 lg:mx-auto max-w-4xl rounded-xl bg-topbar p-6 sm:p-8 mb-10">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">SUBSCRIBE</h2>
      <p className="text-sm text-muted-foreground mb-6">Get The Best Deals Now!</p>
      <div className="flex items-center gap-4">
        {[
          <svg key="fb" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
          <svg key="yt" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>,
          <svg key="ig" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
          <svg key="tw" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
        ].map((icon) => (
          <span key={icon.key} className="cursor-pointer hover:opacity-80 transition-opacity">{icon}</span>
        ))}
      </div>
    </div>
  </>
);

export default LegalPageSections;
