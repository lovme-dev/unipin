import { Facebook, Instagram, Youtube, Twitter, MessageCircle, Phone, Mail, HelpCircle, MessageSquare } from "lucide-react";

const supportItems = [
  { icon: MessageCircle, label: "Messenger" },
  { icon: Phone, label: "Whatsapp" },
  { icon: Mail, label: "Email" },
  { icon: HelpCircle, label: "FAQ" },
  { icon: MessageSquare, label: "Give Feedback" },
];

const LegalPageSections = () => (
  <>
    {/* Customer Support */}
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Customer Support</h2>
      <p className="text-sm text-muted-foreground mb-6">Reach Us At</p>
      <div className="flex flex-wrap gap-3">
        {supportItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center gap-2 w-[100px] sm:w-[130px] h-[90px] sm:h-[100px] rounded-lg border-2 border-primary/70 bg-[hsl(30,30%,18%)] hover:bg-[hsl(30,30%,22%)] transition-colors"
          >
            <Icon className="w-7 h-7 text-primary" />
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
        <a href="#" className="text-foreground hover:text-primary transition-colors"><Facebook className="w-6 h-6" /></a>
        <a href="#" className="text-foreground hover:text-primary transition-colors"><Instagram className="w-6 h-6" /></a>
        <a href="#" className="text-foreground hover:text-primary transition-colors"><Youtube className="w-6 h-6" /></a>
        <a href="#" className="text-foreground hover:text-primary transition-colors"><Twitter className="w-6 h-6" /></a>
      </div>
    </div>
  </>
);

export default LegalPageSections;
