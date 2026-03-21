import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Crown, ShieldCheck, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

const brandPillars = [
  {
    title: "Curated Diamond Intelligence",
    body: "Every stone is screened for visual performance, proportion quality, and documentation clarity before it reaches our catalog.",
  },
  {
    title: "Luxury Craft Execution",
    body: "From sketch to polish, our jewelry and watch projects follow detail-first craftsmanship with strict finishing benchmarks.",
  },
  {
    title: "Transparent Buying Experience",
    body: "We prioritize clear guidance, certification confidence, and direct communication so clients can choose without uncertainty.",
  },
];

const pillarIconByTitle: Record<string, string> = {
  "curated diamond intelligence": "/icons/diamond_5033075.png",
  "luxury craft execution": "/icons/luxury.png",
  "transparent buying experience": "/icons/customer-care_6012388.png",
};

const About = () => {
  const [content, setContent] = useState({
    title: "About VMORA",
    body: "VMORA is a luxury diamond and design house built for clients who value brilliance, precision, and trust. We combine transparent stone intelligence with bespoke jewelry and watch craftsmanship to create pieces that feel personal and enduring.",
  });

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content?key=about");
        if (!response.ok || !active) return;
        const payload = await response.json();
        const cms = payload?.content?.payload;

        if (cms && typeof cms === "object") {
          setContent((prev) => ({
            title: typeof cms.title === "string" && cms.title.trim() ? cms.title : prev.title,
            body: typeof cms.body === "string" && cms.body.trim() ? cms.body : prev.body,
          }));
        }
      } catch {
        // Keep fallback content when API is unavailable.
      }
    };

    void loadContent();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "About VMORA | Luxury Diamond House & Bespoke Design";

    const touchMetaTag = (selector: string, attrs: Record<string, string>, text: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      let created = false;

      if (!element) {
        element = document.createElement("meta");
        Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
        element.dataset.vmoraSeo = "about";
        document.head.appendChild(element);
        created = true;
      }

      const previousContent = element.getAttribute("content");
      element.setAttribute("content", text);

      return () => {
        if (!element) return;
        if (created) {
          element.remove();
          return;
        }
        if (previousContent === null) {
          element.removeAttribute("content");
        } else {
          element.setAttribute("content", previousContent);
        }
      };
    };

    const descCleanup = touchMetaTag(
      'meta[name="description"]',
      { name: "description" },
      "Discover VMORA: a luxury diamond and bespoke design house offering certified loose diamonds, custom jewelry, and premium watch creations."
    );

    const ogTitleCleanup = touchMetaTag(
      'meta[property="og:title"]',
      { property: "og:title" },
      "About VMORA | Luxury Diamond House"
    );

    const ogDescCleanup = touchMetaTag(
      'meta[property="og:description"]',
      { property: "og:description" },
      "Learn how VMORA blends transparent diamond sourcing with bespoke luxury design and craftsmanship."
    );

    return () => {
      document.title = previousTitle;
      descCleanup();
      ogTitleCleanup();
      ogDescCleanup();
    };
  }, []);

  return (
    <SiteLayout>
      <section className="bg-background py-10 lg:py-14">
        <div className="container mx-auto px-4 lg:px-10">
          <header className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Crown className="h-3.5 w-3.5" />
              The House Of VMORA
            </p>

            <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-6xl">{content.title}</h1>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">{content.body}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="luxury">
                <Link to="/diamonds">
                  Explore Loose Diamonds
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/design-line-up">
                  View Design Line Up
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </header>

          <section className="mt-8 grid gap-5 lg:grid-cols-3">
            {brandPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-3 inline-flex rounded-full border border-primary/20 bg-primary/10 p-2 text-primary">
                  <img
                    src={pillarIconByTitle[pillar.title.trim().toLowerCase()] || "/icons/diamond_5033075.png"}
                    alt={`${pillar.title} icon`}
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                  />
                </div>
                <h2 className="font-heading text-2xl text-foreground">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-2xl text-foreground">What Makes Us Different</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Client-first advisory approach for every budget and occasion.",
                  "Quality-led stone selection with verified grading transparency.",
                  "Bespoke jewelry and watch design supported by expert craftsmanship.",
                  "Clear communication from consultation to final delivery.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75">
                <ShieldCheck className="h-4 w-4" />
                Trust Promise
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground">Built On Transparency, Designed For Legacy</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
                VMORA is built for clients who want confidence in every detail, from certification and sourcing clarity to design precision and final finishing.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/certificate-verification">
                  Verify A Certificate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
