import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/contexts/StoreContext";
import { Analytics } from "@vercel/analytics/react";
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const DesignLineUp = lazy(() => import("./pages/DesignLineUp.tsx"));
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
const AdminContent = lazy(() => import("./pages/AdminContent.tsx"));
const AdminListings = lazy(() => import("./pages/AdminListings.tsx"));
const AdminHistory = lazy(() => import("./pages/AdminHistory.tsx"));
const Compare = lazy(() => import("./pages/Compare.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Analytics />
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm uppercase tracking-[0.12em] text-muted-foreground">Loading VMORA</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/design-line-up" element={<DesignLineUp />} />
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
              <Route path="/admin/history" element={<AdminHistory />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
