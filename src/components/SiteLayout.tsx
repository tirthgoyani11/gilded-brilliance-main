import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-[88px] lg:pt-[104px]">
      {children}
    </main>
    <Footer />
    <WhatsAppFloat />
  </div>
);

export default SiteLayout;
