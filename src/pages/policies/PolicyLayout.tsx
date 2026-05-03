import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const POLICY_LINKS = [
  { name: "Shipping & Delivery", path: "/shipping-policy" },
  { name: "Return & Refund Policy", path: "/return-policy" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms-and-conditions" },
  { name: "Returns & Exchanges", path: "/exchange-policy" },
];

export default function PolicyLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-12 mt-12">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-1/4 hidden md:block">
              <h3 className="text-xl font-light tracking-wide text-vmora-black mb-8 uppercase">Policies</h3>
              <nav className="flex flex-col space-y-4">
                {POLICY_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                      location.pathname === link.path
                        ? "text-vmora-black font-medium"
                        : "text-gray-500 hover:text-vmora-black"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Mobile Navigation Dropdown (Optional for future, but Kohira usually lists it out or leaves to standard mobile behavior) */}
            <div className="md:hidden mb-8 border-b border-gray-200 pb-4">
               <h3 className="text-xl font-light tracking-wide text-vmora-black mb-4 uppercase">Policies</h3>
               <select 
                 className="w-full border-gray-300 rounded text-sm tracking-wider uppercase bg-transparent p-3 outline-none focus:ring-0"
                 value={location.pathname}
                 onChange={(e) => window.location.href = e.target.value}
               >
                 {POLICY_LINKS.map((link) => (
                   <option key={link.path} value={link.path}>
                     {link.name}
                   </option>
                 ))}
               </select>
            </div>

            {/* Main Content */}
            <article className="w-full md:w-3/4 max-w-4xl prose prose-sm md:prose-base prose-headings:font-light prose-headings:tracking-wide prose-headings:text-vmora-black prose-a:text-vmora-black hover:prose-a:text-gray-600 prose-p:text-gray-600 prose-li:text-gray-600">
              <h1 className="text-3xl md:text-4xl font-light tracking-wider text-vmora-black uppercase mb-8 pb-4 border-b border-gray-100">
                {title}
              </h1>
              <div className="policy-content space-y-6 text-sm md:text-base leading-relaxed tracking-wide font-light">
                {children}
              </div>
            </article>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
