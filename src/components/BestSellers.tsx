import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="font-accent italic text-primary text-sm mb-3">Most Coveted</p>
            <h2 className="font-heading text-3xl lg:text-4xl text-foreground">Best Sellers</h2>
          </div>
          <a href="/jewelry" className="gold-underline text-xs uppercase tracking-[0.15em] font-body text-foreground/60 hover:text-foreground pb-1 hidden md:block">
            View All
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-[12px] overflow-hidden shadow-luxury luxury-transition group-hover:shadow-luxury-hover mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover luxury-transition group-hover:scale-105"
                  loading="lazy"
                />
                {/* Wishlist */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 luxury-transition hover:bg-background">
                  <Heart className="w-3.5 h-3.5 text-foreground" />
                </button>
                {/* Quick view */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition">
                  <button className="w-full py-2.5 bg-foreground/90 backdrop-blur-sm text-background text-[10px] uppercase tracking-[0.15em] font-body rounded-[4px] hover:bg-foreground luxury-transition">
                    Quick View
                  </button>
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.12em] font-body text-muted-foreground mb-1">{product.category}</p>
              <h3 className="font-heading text-sm text-foreground mb-1">{product.name}</h3>
              <p className="font-body text-sm text-foreground tabular-nums">{product.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
