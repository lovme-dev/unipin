import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import unipinLogo from "@/assets/unipin-logo.svg";

const filterOptions = [
  { label: "1 day", value: 1 },
  { label: "2 days", value: 2 },
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
];

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedLabel = filterOptions.find(f => f.value === selectedFilter)?.label || "1 day";

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
        <div className="relative z-10 px-3 py-2 flex items-center justify-between">
          <img src={unipinLogo} alt="UniPin" className="h-5" />
        </div>
      </div>

      {/* Transaction History Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Transaction History</h1>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border/50 text-sm text-foreground"
          >
            {selectedLabel}
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-[59]" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-[60] min-w-[100px] shadow-xl border border-border/30" style={{ background: 'hsl(220, 40%, 13%)' }}>
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSelectedFilter(opt.value); setDropdownOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                      selectedFilter === opt.value ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* No Data */}
      <div className="mx-4">
        <div className="bg-white rounded-lg py-3 text-center">
          <span className="text-sm text-gray-600">No data found</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
