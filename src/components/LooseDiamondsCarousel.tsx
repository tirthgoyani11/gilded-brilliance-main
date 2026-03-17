import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const shapes = [
  { name: "Round", img: "/shapes/round-Diamond.png" },
  { name: "Princess", img: "/shapes/princess-Diamond.png" },
  { name: "Emerald", img: "/shapes/emerald-Diamond.png" },
  { name: "Asscher", img: "/shapes/asscher-Diamond.png" },
  { name: "Oval", img: "/shapes/oval-Diamond.png" },
  { name: "Pear", img: "/shapes/pear-Diamond.png" },
  { name: "Heart", img: "/shapes/heart-Diamond.png" },
  { name: "Marquise", img: "/shapes/marquise-Diamond.png" },
  { name: "Cushion", img: "/shapes/cushion-Diamond.png" },
  { name: "Radiant", img: "/shapes/radiant-Diamond.png" },
];

const LooseDiamondsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % shapes.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + shapes.length) % shapes.length);
  };

  const getVisibleShapes = () => {
    const items = [];
    // We want to show 5 items: active in center, 2 on left, 2 on right
    for (let i = -2; i <= 2; i++) {
      let index = (activeIndex + i) % shapes.length;
      if (index < 0) {
        index += shapes.length;
      }
      items.push({ ...shapes[index], offset: i, originalIndex: index });
    }
    return items;
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-border/40">
      
      {/* Background Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full opacity-60 blur-3xl mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Content */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#C9A646] font-medium mb-4">
              EXPERIENCE THE
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading text-primary mb-6 tracking-tight">
              DIAMOND REVOLUTION
            </h3>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">
              Spin actual diamonds in 360° HD and zoom in up to 40x. One of the world's biggest collections of loose diamonds, at your fingertips.
            </p>
          </motion.div>
        </div>

        {/* Carousel Area */}
        <div className="relative max-w-6xl mx-auto h-[400px] md:h-[500px] flex items-center justify-center">
          
          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:left-8 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-luxury hover:scale-110 transition-transform duration-300 text-foreground"
            aria-label="Previous shape"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 md:right-8 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-luxury hover:scale-110 transition-transform duration-300 text-foreground"
            aria-label="Next shape"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Diamonds Track */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {getVisibleShapes().map((shape) => {
                const isActive = shape.offset === 0;
                
                // Calculate dynamic styles based on offset from center
                const scale = isActive ? 1 : Math.max(0.4, 1 - Math.abs(shape.offset) * 0.3);
                const xPos = shape.offset * 180; // Distance between items
                const zIndex = 10 - Math.abs(shape.offset);
                const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(shape.offset) * 0.4);
                const blur = isActive ? 0 : Math.abs(shape.offset) * 2;

                return (
                  <motion.div
                    key={`${shape.name}-${shape.originalIndex}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      x: xPos,
                      scale: scale,
                      zIndex: zIndex,
                      opacity: opacity,
                      filter: `blur(${blur}px)`,
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 20,
                      mass: 0.8
                    }}
                    className="absolute flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => setActiveIndex(shape.originalIndex)}
                  >
                    <div className="relative mb-8 transition-all duration-500">
                      <img 
                        src={shape.img} 
                        alt={`${shape.name} cut diamond`}
                        className={`relative z-10 object-contain transition-transform duration-700 ease-in-out ${isActive ? 'w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl hover:scale-105' : 'w-48 h-48 drop-shadow-md'}`}
                      />
                    </div>
                    
                    {/* Label - Only show for active item or fade it heavily */}
                    <div className={`text-center absolute -bottom-12 w-full transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <h4 className="font-heading text-xl text-primary tracking-wide">
                        {shape.name.toUpperCase()}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 font-accent uppercase tracking-widest">
                        Maximizes light return
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Global CTA */}
        <div className="mt-16 text-center">
            <h1 className="text-8xl font-accent text-primary/5 select-none pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 whitespace-nowrap">
              find your sparkle
            </h1>
        </div>

      </div>
    </section>
  );
};

export default LooseDiamondsCarousel;
