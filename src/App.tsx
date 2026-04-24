import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GeoRedirect from "./components/GeoRedirect";
import CountryPage from "./pages/CountryPage";
import NotFound from "./pages/NotFound.tsx";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";
import UserTerms from "./pages/UserTerms.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import TransactionHistoryPage from "./pages/TransactionHistoryPage.tsx";
import ReloadPage from "./pages/ReloadPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import PubgPage from "./pages/PubgPage.tsx";
import CareersPage from "./pages/CareersPage.tsx";
import PaymentChannelsPage from "./pages/PaymentChannelsPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GeoRedirect />} />
          <Route path="/unipin/:countryCode" element={<CountryPage />} />
          <Route path="/pubg" element={<PubgPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/payment-channels" element={<PaymentChannelsPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/user-terms" element={<UserTerms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/transaction-history" element={<TransactionHistoryPage />} />
          <Route path="/reload" element={<ReloadPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
