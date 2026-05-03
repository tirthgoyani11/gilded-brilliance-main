import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ringImg from "@/assets/product-ring.jpg";
import earringsImg from "@/assets/product-earrings.jpg";
import necklaceImg from "@/assets/product-necklace.jpg";
import braceletImg from "@/assets/product-bracelet.jpg";
import looseDiamondsImg from "@/assets/product-loose-diamonds.jpg";

const categories = [
  { name: "Rings", image: ringImg, href: "/jewelry/rings" },
  { name: "Earrings", image: earringsImg, href: "/jewelry/earrings" },
  { name: "Necklaces", image: necklaceImg, href: "/jewelry/necklaces" },
  { name: "Bracelets", image: braceletImg, href: "/jewelry/bracelets" },
  { name: "Loose Diamonds", image: looseDiamondsImg, href: "/diamonds" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const CategorySection = () => {
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-accent italic text-primary text-sm mb-3 block">Curated Collections</span>
            <h2 className="font-heading text-3xl lg:text-4xl text-foreground">Shop by Category</h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              <Link to={cat.href} className="group block diamond-glow">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-luxury luxury-transition group-hover:shadow-luxury-hover">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover brightness-[1.1] contrast-[1.05] luxury-transition-slow group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 luxury-transition" />
                  {/* Hover label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 luxury-transition">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-body text-white/90">
                      View Collection →
                    </span>
                  </div>
                  {/* Gold border on hover */}
                  <div className="absolute inset-0 rounded-2xl border-[1.5px] border-transparent group-hover:border-[#C6A87D]/40 luxury-transition pointer-events-none" />
                </div>
                <p className="text-center mt-4 text-xs uppercase tracking-[0.15em] font-body text-foreground/60 group-hover:text-foreground luxury-transition">
                  {cat.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
