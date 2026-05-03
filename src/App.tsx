import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/contexts/StoreContext";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "@/components/ScrollToTop";
import RouteSeo from "@/components/RouteSeo";
import { CurrencyProvider } from "@/components/CurrencyProvider";
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Jewelry = lazy(() => import("./pages/Jewelry.tsx"));
const JewelryDetail = lazy(() => import("./pages/JewelryDetail.tsx"));
const CustomJewelryGenerator = lazy(() => import("./pages/CustomJewelryGenerator.tsx"));
const Diamonds = lazy(() => import("./pages/Diamonds.tsx"));
const DiamondDetail = lazy(() => import("./pages/DiamondDetail.tsx"));
const Education = lazy(() => import("./pages/Education.tsx"));
const CertificateVerification = lazy(() => import("./pages/CertificateVerification.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const AdminImport = lazy(() => import("./pages/AdminImport.tsx"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminListings = lazy(() => import("./pages/AdminListings.tsx"));
const AdminJewelry = lazy(() => import("./pages/AdminJewelry.tsx"));
const AdminHistory = lazy(() => import("./pages/AdminHistory.tsx"));
const Compare = lazy(() => import("./pages/Compare.tsx"));

// Policies
const ShippingPolicy = lazy(() => import("./pages/policies/ShippingPolicy.tsx"));
const ReturnPolicy = lazy(() => import("./pages/policies/ReturnPolicy.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy.tsx"));
const TermsAndConditions = lazy(() => import("./pages/policies/TermsAndConditions.tsx"));
const ExchangePolicy = lazy(() => import("./pages/policies/ExchangePolicy.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Analytics />
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <CurrencyProvider>
          <BrowserRouter>
            <ScrollToTop />
          <RouteSeo />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm uppercase tracking-[0.12em] text-muted-foreground">Loading VMORA</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jewelry" element={<Jewelry />} />
              <Route path="/jewelry/:categorySlug" element={<Jewelry />} />
              <Route path="/jewelry/product/:productId" element={<JewelryDetail />} />
              <Route path="/design-line-up" element={<Navigate to="/jewelry" replace />} />
              <Route path="/custom-jewelry-generator" element={<CustomJewelryGenerator />} />
              <Route path="/diamonds" element={<Diamonds />} />
              <Route path="/diamond/:stoneId" element={<DiamondDetail />} />
              <Route path="/education" element={<Education />} />
              <Route path="/certificate-verification" element={<CertificateVerification />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/import" element={<AdminImport />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/listings" element={<AdminListings />} />
              <Route path="/admin/jewelry" element={<AdminJewelry />} />
              <Route path="/admin/history" element={<AdminHistory />} />
              <Route path="/compare" element={<Compare />} />
              
              {/* Policies */}
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/exchange-policy" element={<ExchangePolicy />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </BrowserRouter>
        </CurrencyProvider>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
