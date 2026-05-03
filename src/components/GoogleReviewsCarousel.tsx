import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    date: "April 2026",
    review: "Absolutely stunning diamonds! The quality exceeded my expectations. The team was incredibly helpful and knowledgeable.",
    avatar: "/placeholder-avatar-1.png",
    verified: true,
  },
  {
    id: 2,
    name: "Rahul Mehta",
    rating: 5,
    date: "April 2026",
    review: "Best jewelry shopping experience ever. The transparency in pricing and certification gave me complete confidence.",
    avatar: "/placeholder-avatar-2.png",
    verified: true,
  },
  {
    id: 3,
    name: "Ananya Patel",
    rating: 5,
    date: "April 2026",
    review: "Found my dream engagement ring here. The custom design process was seamless and the result is breathtaking.",
    avatar: "/placeholder-avatar-3.png",
    verified: true,
  },
  {
    id: 4,
    name: "William Anderson",
    rating: 4,
    date: "April 2026",
    review: "Exceptional service from start to finish. The diamond I purchased has incredible fire and brilliance.",
    avatar: "/placeholder-avatar-4.png",
    verified: true,
  },
  {
    id: 5,
    name: "Sneha Reddy",
    rating: 5,
    date: "April 2026",
    review: "The attention to detail is remarkable. My custom piece turned out even better than I imagined.",
    avatar: "/placeholder-avatar-5.png",
    verified: true,
  },
  {
    id: 6,
    name: "Vikram Singh",
    rating: 5,
    date: "April 2026",
    review: "Professional, trustworthy, and the quality is unmatched. Will definitely be returning for future purchases.",
    avatar: "/placeholder-avatar-6.png",
    verified: true,
  },
  {
    id: 7,
    name: "Emma Thompson",
    rating: 5,
    date: "April 2026",
    review: "The certification process was so transparent. I felt completely confident in my purchase. Highly recommend!",
    avatar: "/placeholder-avatar-7.png",
    verified: true,
  },
  {
    id: 8,
    name: "Arjun Kapoor",
    rating: 5,
    date: "April 2026",
    review: "Purchased a diamond for my wife's anniversary. She was speechless! The quality is truly exceptional.",
    avatar: "/placeholder-avatar-8.png",
    verified: true,
  },
  {
    id: 9,
    name: "Sophie Williams",
    rating: 4,
    date: "April 2026",
    review: "Great selection and fair pricing. The team guided me through every step of the process.",
    avatar: "/placeholder-avatar-9.png",
    verified: true,
  },
  {
    id: 10,
    name: "Kavita Nair",
    rating: 5,
    date: "April 2026",
    review: "The custom jewelry design exceeded all my expectations. True craftsmanship at its finest.",
    avatar: "/placeholder-avatar-10.png",
    verified: true,
  },
  {
    id: 11,
    name: "Marcus Johnson",
    rating: 5,
    date: "April 2026",
    review: "Outstanding customer service. They answered all my questions and helped me find the perfect diamond.",
    avatar: "/placeholder-avatar-11.png",
    verified: true,
  },
  {
    id: 12,
    name: "Deepak Joshi",
    rating: 5,
    date: "April 2026",
    review: "Best investment I've made. The diamond's brilliance is unmatched. Thank you VMORA!",
    avatar: "/placeholder-avatar-12.png",
    verified: true,
  },
];

const GoogleReviewsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const StarIcon = () => (
    <svg className="w-4 h-4 fill-[#FBBC05]" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#FFF9F0] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <GoogleIcon />
            <span className="font-heading text-2xl lg:text-3xl text-foreground">
              Google Reviews
            </span>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl text-foreground mb-3">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
            <span className="font-body text-muted-foreground text-sm ml-2">
              4.8 Rating from hundreds of satisfied customers
            </span>
          </div>
        </motion.div>

        {/* Infinite Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden scrollbar-hide"
            style={{ cursor: isPaused ? "grab" : "default" }}
          >
            {/* Original reviews */}
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-[320px] md:w-[380px] bg-white rounded-2xl p-6 shadow-luxury border border-border luxury-transition hover:shadow-luxury-hover hover:border-[#C6A87D]/30 diamond-glow"
              >
                {/* Reviewer Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C6A87D]/20 to-[#C6A87D]/5 flex items-center justify-center">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `<span class="font-heading text-[#C6A87D] text-lg">${review.name.charAt(0)}</span>`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-foreground text-sm font-medium">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <svg className="w-4 h-4 text-[#C6A87D]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                  "{review.review}"
                </p>

                {/* Date */}
                <p className="font-body text-muted-foreground/60 text-xs">
                  {review.date}
                </p>
              </motion.div>
            ))}

            {/* Duplicate reviews for infinite scroll */}
            {reviews.map((review) => (
              <motion.div
                key={`duplicate-${review.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-[320px] md:w-[380px] bg-white rounded-2xl p-6 shadow-luxury border border-border luxury-transition hover:shadow-luxury-hover hover:border-[#C6A87D]/30 diamond-glow"
              >
                {/* Reviewer Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C6A87D]/20 to-[#C6A87D]/5 flex items-center justify-center">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `<span class="font-heading text-[#C6A87D] text-lg">${review.name.charAt(0)}</span>`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-foreground text-sm font-medium">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <svg className="w-4 h-4 text-[#C6A87D]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                  "{review.review}"
                </p>

                {/* Date */}
                <p className="font-body text-muted-foreground/60 text-xs">
                  {review.date}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Fade gradients on sides */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* Google Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-border shadow-sm">
            <GoogleIcon />
            <span className="font-body text-sm text-muted-foreground">
              Reviews from Google
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviewsCarousel;
