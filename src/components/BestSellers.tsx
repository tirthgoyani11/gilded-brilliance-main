import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { Link } from "react-router-dom";
import ringImg from "@/assets/product-ring.jpg";
import earringsImg from "@/assets/product-earrings.jpg";
import necklaceImg from "@/assets/product-necklace.jpg";
import braceletImg from "@/assets/product-bracelet.jpg";

const products = [
  { name: "Celestial Solitaire Ring", price: "$3,450", category: "Rings", image: ringImg },
  { name: "Etoile Stud Earrings", price: "$1,890", category: "Earrings", image: earringsImg },
  { name: "Vmora Halo Pendant", price: "$2,240", category: "Necklaces", image: necklaceImg },
  { name: "Aurora Tennis Bracelet", price: "$4,680", category: "Bracelets", image: braceletImg },
];

const BestSellers = () => {
  const { toggleWishlist, isWishlisted } = useStore();
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-[#FAFAFA]">
      {/* Marble Background Texture */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: 'url(/marble-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex items-end justify-between mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-accent italic text-primary text-sm mb-3 block">
                Featured Collections
              </span>
              <h2 className="font-heading text-3xl lg:text-4xl text-foreground">Best Sellers</h2>
            </motion.div>
          </div>
          <Link
            to="/jewelry"
            className="gold-underline text-xs uppercase tracking-[0.15em] font-body text-foreground/50 hover:text-foreground pb-1 hidden md:block"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-luxury luxury-transition group-hover:shadow-luxury-hover mb-4 diamond-glow">
                {/* Popular Choice Badge */}
                {i === 0 && (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#FAFAFA]/90 backdrop-blur-md rounded-md border border-border shadow-sm">
                    <span className="text-[9px] uppercase tracking-[0.15em] font-medium text-foreground">Most Loved</span>
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover brightness-[1.05] contrast-[1.02] luxury-transition-slow group-hover:scale-110"
                  loading="lazy"
                />
                {/* Wishlist */}
                <button 
                  className={`absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center luxury-transition hover:scale-110 z-10 shadow-sm border border-border/50 group-hover:opacity-100 ${isWishlisted(product.name) ? "bg-primary text-white opacity-100" : "bg-white/80 text-foreground opacity-0 hover:bg-white"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.name);
                  }}
                  aria-label={isWishlisted(product.name) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.name) ? "fill-current" : ""}`} />
                </button>
                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent opacity-0 group-hover:opacity-100 luxury-transition pointer-events-none" />
                {/* Quick view */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition z-10">
                  <button className="w-full py-3 bg-[#FAFAFA]/95 backdrop-blur-md text-foreground text-[10px] uppercase tracking-[0.15em] font-body rounded-lg hover:bg-white border border-border/50 shadow-sm luxury-transition font-medium">
                    Quick View
                  </button>
                </div>
                {/* Gold border on hover */}
                <div className="absolute inset-0 rounded-2xl border-[1.5px] border-transparent group-hover:border-[#C6A87D]/30 luxury-transition pointer-events-none" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.12em] font-body text-muted-foreground mb-1.5">{product.category}</p>
              <h3 className="font-heading text-sm text-foreground mb-1.5">{product.name}</h3>
              <p className="font-body text-sm text-foreground font-medium tabular-nums">{product.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
