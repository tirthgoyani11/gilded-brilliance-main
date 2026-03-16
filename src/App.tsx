import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/contexts/StoreContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Jewelry from "./pages/Jewelry.tsx";
import Diamonds from "./pages/Diamonds.tsx";
import DiamondDetail from "./pages/DiamondDetail.tsx";
import RingBuilder from "./pages/RingBuilder.tsx";
import Education from "./pages/Education.tsx";
import CertificateVerification from "./pages/CertificateVerification.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Account from "./pages/Account.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminImport from "./pages/AdminImport.tsx";
import Compare from "./pages/Compare.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jewelry" element={<Jewelry />} />
            <Route path="/diamonds" element={<Diamonds />} />
            <Route path="/diamond/:stoneId" element={<DiamondDetail />} />
            <Route path="/ring-builder" element={<RingBuilder />} />
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
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
