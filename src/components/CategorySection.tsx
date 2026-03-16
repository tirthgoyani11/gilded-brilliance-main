import { motion } from "framer-motion";
import ringImg from "@/assets/product-ring.jpg";
import earringsImg from "@/assets/product-earrings.jpg";
import necklaceImg from "@/assets/product-necklace.jpg";
import braceletImg from "@/assets/product-bracelet.jpg";
import looseDiamondsImg from "@/assets/product-loose-diamonds.jpg";

const categories = [
  { name: "Rings", image: ringImg },
  { name: "Earrings", image: earringsImg },
  { name: "Necklaces", image: necklaceImg },
  { name: "Bracelets", image: braceletImg },
  { name: "Loose Diamonds", image: looseDiamondsImg },
];

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const CategorySection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-accent italic text-primary text-sm mb-3">Curated Collections</p>
          <h2 className="font-heading text-3xl lg:text-4xl text-foreground">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-[12px] overflow-hidden shadow-luxury luxury-transition group-hover:shadow-luxury-hover">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover luxury-transition group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 luxury-transition" />
              </div>
              <p className="text-center mt-4 text-xs uppercase tracking-[0.15em] font-body text-foreground/80 group-hover:text-foreground luxury-transition">
                {cat.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
