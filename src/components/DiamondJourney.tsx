import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    title: "Sourced with Integrity",
    subtitle: "Ethical Origins",
    description: "Every diamond begins its journey deep within the earth, sourced with strict ethical standards.",
  },
  {
    title: "Refined to Brilliance",
    subtitle: "Expert Cutting",
    description: "Master artisans cut and polish each rough stone to maximize its fire, brilliance, and scintillation.",
  },
  {
    title: "Shaped by Experts",
    subtitle: "Precision Crafting",
    description: "Your chosen diamond is securely set into precision-crafted jewelry by our master jewelers.",
  },
  {
    title: "Delivered Without Intermediaries",
    subtitle: "Direct to You",
    description: "Your bespoke piece travels straight from the jeweler to your hands — insured and discreet.",
  },
];

const DiamondJourney = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // DESKTOP TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1, 
          pin: true,
        },
      });

      tl.fromTo(
        diamondRef.current,
        { scale: 0.2, opacity: 0 },
        { scale: 2.5, opacity: 1, ease: "power1.inOut", duration: 2.1 },
        0 
      );

      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        tl.fromTo(
          step,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          i * 0.8 + 0.5 
        );
        tl.to(
          step,
          { y: -40, duration: 2, ease: "none" },
          i * 0.8 + 1.3 
        );
      });
    });

    mm.add("(max-width: 767px)", () => {
      // MOBILE TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2000", // slightly shorter scroll space needed for mobile vertically stacked
          scrub: 1,
          pin: true,
        },
      });

      // Smaller max scale for portrait screens so it doesn't break edges
      tl.fromTo(
        diamondRef.current,
        { scale: 0.3, opacity: 0, yPercent: -40 }, // Start slightly higher
        { scale: 1.4, opacity: 1, yPercent: 0, ease: "power1.inOut", duration: 2 },
        0
      );

      // Steps just fade in staggered, no complex absolute positioning movement needed
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        tl.fromTo(
          step,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          i * 0.6 + 0.5
        );
      });
    });

    return () => mm.revert(); // Cleanup matching media
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-[radial-gradient(circle,#1a1a1a,#050505)] overflow-hidden">
      
      {/* Background Graphic */}
      <img src="/process-bg.png" alt="Decorative diamond journey background" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-screen" />

      {/* Title block at the top */}
      <div className="absolute top-[10%] left-0 right-0 text-center z-20">
        <h2 className="font-heading text-4xl md:text-5xl text-white mb-3">From Earth to Elegance</h2>
        <p className="font-accent italic text-[#C6A87D] text-lg tracking-widest">Transparency in every carat.</p>
      </div>

      {/* Floating Center Diamond */}
      <div 
        ref={diamondRef} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full flex items-center justify-center will-change-transform pointer-events-none"
      >
        <img 
          src="/process-diamond.png" 
          alt="VMORA Diamond" 
          className="w-[180px] md:w-[280px]" 
        />
      </div>

      {/* Steps Container */}
      {/* 
        On Desktop (md:), the steps are absolutely positioned into the 4 corners around the max-scaled diamond.
        On Mobile, they are absolutely positioned into a standard vertical flow column, centered padding, so they overlay smoothly. 
      */}
      <div className="absolute inset-x-0 bottom-0 top-[25%] md:top-0 z-20 pointer-events-none flex flex-col md:block items-center justify-around pb-12 px-6">
        {processSteps.map((step, i) => {
          let desktopPositionClasses = "";
          if (i === 0) desktopPositionClasses = "md:absolute md:top-[25%] md:left-[10%] xl:left-[15%]";
          if (i === 1) desktopPositionClasses = "md:absolute md:top-[30%] md:right-[10%] xl:right-[15%] md:text-right";
          if (i === 2) desktopPositionClasses = "md:absolute md:bottom-[30%] md:left-[10%] xl:left-[15%]";
          if (i === 3) desktopPositionClasses = "md:absolute md:bottom-[20%] md:right-[10%] xl:right-[15%] md:text-right";

          return (
            <div
              key={i}
              className={`w-[280px] md:w-[320px] text-white opacity-0 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:drop-shadow-none md:text-left ${desktopPositionClasses}`}
              ref={(el) => (stepsRef.current[i] = el)}
            >
              <span className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#C6A87D] font-medium mb-1 md:mb-3">
                Step 0{i + 1}
              </span>
              <h3 className="font-heading text-xl md:text-3xl text-white mb-2 leading-tight">
                {step.title}
              </h3>
              <p className="font-body text-white/80 md:text-white/60 text-xs md:text-sm leading-[1.6] md:leading-[1.8]">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default DiamondJourney;
