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
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000", // Increased scroll distance for smoother, longer zoom
          scrub: 1, // Smoothing
          pin: true,
        },
      });

      // 1. Diamond zoom and fade up tied to the scroll (scrubbed)
      // The zoom stops progressing right as Step 3 is revealed (timeline position 2.1)
      tl.fromTo(
        diamondRef.current,
        { scale: 0.2, opacity: 0 },
        { scale: 2.5, opacity: 1, ease: "power1.inOut", duration: 2.1 },
        0 // Start at the very beginning of the timeline
      );

      // 2. Sequential reveal of steps spaced out across the scroll
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        // Fade in and slide up each step
        tl.fromTo(
          step,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          i * 0.8 + 0.5 // Stagger their entry along the timeline
        );
        
        // Parallax Depth on steps while scrolling continues
        tl.to(
          step,
          { y: -40, duration: 2, ease: "none" },
          i * 0.8 + 1.3 // Parallax starts slightly after they fade in
        );
      });

    }, sectionRef);

    return () => ctx.revert(); // Cleanup GSAP
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-[radial-gradient(circle,#1a1a1a,#050505)] overflow-hidden">
      
      {/* Background Graphic */}
      <img src="/process-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-screen" />

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
      {processSteps.map((step, i) => {
        // Compute positioning using Tailwind
        let positionClasses = "";
        if (i === 0) positionClasses = "top-[25%] left-[5%] md:left-[10%] xl:left-[15%]";
        if (i === 1) positionClasses = "top-[30%] right-[5%] md:right-[10%] xl:right-[15%] text-right";
        if (i === 2) positionClasses = "bottom-[30%] left-[5%] md:left-[10%] xl:left-[15%]";
        if (i === 3) positionClasses = "bottom-[20%] right-[5%] md:right-[10%] xl:right-[15%] text-right";

        return (
          <div
            key={i}
            className={`absolute w-[280px] md:w-[320px] text-white opacity-0 z-20 ${positionClasses}`}
            ref={(el) => (stepsRef.current[i] = el)}
          >
            <span className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#C6A87D] font-medium mb-3">
              Step 0{i + 1}
            </span>
            <h3 className="font-heading text-2xl md:text-3xl text-white mb-2 leading-tight">
              {step.title}
            </h3>
            <p className="font-body text-white/60 text-sm leading-[1.8]">
              {step.description}
            </p>
          </div>
        );
      })}

    </section>
  );
};

export default DiamondJourney;
