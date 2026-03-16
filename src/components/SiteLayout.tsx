import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 lg:pt-24">{children}</main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
