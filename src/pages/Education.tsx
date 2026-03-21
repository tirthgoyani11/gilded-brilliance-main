import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Topic = {
  title: string;
  body: string;
};

const fallbackTopics: Topic[] = [
  {
    title: "Cut",
    body: "Cut quality drives brilliance, fire, and sparkle. Excellent cut diamonds usually look more alive than larger stones with weak cut performance.",
  },
  {
    title: "Color",
    body: "Color grades typically run from D to Z. Near-colorless ranges can deliver strong visual value, especially in well-balanced white metal settings.",
  },
  {
    title: "Clarity",
    body: "Clarity measures inclusions and blemishes. Eye-clean stones often offer superior value because they appear clean without paying for microscopic perfection.",
  },
  {
    title: "Carat",
    body: "Carat is weight, not visible size alone. Proportions, cut precision, and shape all influence how large a diamond appears on hand.",
  },
];

const buyingFramework = [
  {
    title: "Define Your Priority",
    text: "Set your target between size, sparkle, rarity, or budget before comparing stones.",
  },
  {
    title: "Shortlist By 4Cs",
    text: "Use cut, color, clarity, and carat together instead of optimizing only one metric.",
  },
  {
    title: "Verify Certification",
    text: "Cross-check grading reports and match them against the actual stone and measurements.",
  },
  {
    title: "Match To Jewelry Design",
    text: "Choose a stone that complements your final ring, pendant, or watch design direction.",
  },
];

const faqs = [
  {
    question: "What is the most important C when buying a diamond?",
    answer:
      "For most buyers, cut is the most important because it controls light return and sparkle. A well-cut diamond can look more premium than a larger but poorly cut stone.",
  },
  {
    question: "Should I choose size or quality first?",
    answer:
      "The best approach is balance. Start with your budget, then optimize cut first, followed by carat appearance, color, and clarity based on your setting and daily wear preferences.",
  },
  {
    question: "Do I really need a certified diamond?",
    answer:
      "Yes. Independent grading gives objective quality benchmarks and helps you compare stones transparently. It also supports future resale, insurance, and confidence.",
  },
  {
    question: "Can I use this education guide before custom jewelry design?",
    answer:
      "Absolutely. Understanding the 4Cs before design helps you choose the right center stone and prevents overpaying for specs that do not improve visible beauty.",
  },
];

const topicIconByTitle: Record<string, string> = {
  cut: "/icons/4c-cut.svg",
  color: "/icons/4c-color.svg",
  clarity: "/icons/4c-clarity.svg",
  carat: "/icons/4c-carat.svg",
};

const Education = () => {
  const [content, setContent] = useState({
    title: "Diamond Education Guide",
    subtitle: "Learn the 4Cs, understand certification, and make a high-confidence buying decision.",
    topics: fallbackTopics,
  });

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content?key=education");
        if (!response.ok || !active) return;

        const payload = await response.json();
        const cms = payload?.content?.payload;
        if (!cms || typeof cms !== "object") return;

        const nextTopics = Array.isArray(cms.topics)
          ? cms.topics
              .map((topic: { title?: unknown; body?: unknown }) => ({
                title: String(topic?.title ?? "").trim(),
                body: String(topic?.body ?? "").trim(),
              }))
              .filter((topic: Topic) => topic.title && topic.body)
          : null;

        setContent((prev) => ({
          title: typeof cms.title === "string" && cms.title.trim() ? cms.title : prev.title,
          subtitle: typeof cms.subtitle === "string" && cms.subtitle.trim() ? cms.subtitle : prev.subtitle,
          topics: nextTopics && nextTopics.length > 0 ? nextTopics : prev.topics,
        }));
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
    document.title = "Diamond Education Guide | 4Cs, Certification & Buying Tips | VMORA";

    const touchMetaTag = (selector: string, attrs: Record<string, string>, content: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      let created = false;

      if (!element) {
        element = document.createElement("meta");
        Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
        element.dataset.vmoraSeo = "education";
        document.head.appendChild(element);
        created = true;
      }

      const previousContent = element.getAttribute("content");
      element.setAttribute("content", content);

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
      "Learn diamond cut, color, clarity, and carat with VMORA's premium education guide. Compare stones better, verify certification, and buy with confidence."
    );

    const ogTitleCleanup = touchMetaTag(
      'meta[property="og:title"]',
      { property: "og:title" },
      "Diamond Education Guide | VMORA"
    );

    const ogDescCleanup = touchMetaTag(
      'meta[property="og:description"]',
      { property: "og:description" },
      "Master the 4Cs and certification basics to choose the right diamond for your jewelry or watch project."
    );

    const canonicalSelector = 'link[rel="canonical"]';
    let canonical = document.head.querySelector(canonicalSelector) as HTMLLinkElement | null;
    let canonicalCreated = false;
    const previousCanonicalHref = canonical?.getAttribute("href") ?? null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.dataset.vmoraSeo = "education";
      document.head.appendChild(canonical);
      canonicalCreated = true;
    }

    canonical.setAttribute("href", `${window.location.origin}/education`);

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.dataset.vmoraSeo = "education";
    schemaScript.text = JSON.stringify(faqSchema);
    document.head.appendChild(schemaScript);

    return () => {
      document.title = previousTitle;
      descCleanup();
      ogTitleCleanup();
      ogDescCleanup();

      if (canonical) {
        if (canonicalCreated) {
          canonical.remove();
        } else if (previousCanonicalHref === null) {
          canonical.removeAttribute("href");
        } else {
          canonical.setAttribute("href", previousCanonicalHref);
        }
      }

      schemaScript.remove();
    };
  }, []);

  return (
    <SiteLayout>
      <section className="bg-background py-10 lg:py-14">
        <div className="container mx-auto px-4 lg:px-10">
          <header className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              Education Hub
            </p>

            <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-6xl">{content.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{content.subtitle}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "4Cs Mastery Framework",
                "Certification Confidence",
                "Practical Buying Strategy",
                "Luxury Design Alignment",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-foreground/80">
                  {item}
                </div>
              ))}
            </div>
          </header>

          <section className="mt-8">
            <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Understand The 4Cs Like A Professional</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
              These four pillars define visible beauty and long-term value. Use them together to compare diamonds with clarity and precision.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {content.topics.map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="mb-3 inline-flex rounded-full border border-primary/20 bg-primary/10 p-2 text-primary">
                    <img
                      src={topicIconByTitle[topic.title.trim().toLowerCase()] || "/icons/4c-cut.svg"}
                      alt={`${topic.title} icon`}
                      className="h-4 w-4 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-heading text-xl text-foreground">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{topic.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-2xl text-foreground">Diamond Buying Framework</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Follow this sequence to avoid common mistakes and choose a stone that performs beautifully in real life.
              </p>

              <ol className="mt-5 space-y-4">
                {buyingFramework.map((step, index) => (
                  <li key={step.title} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/85">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-2xl text-foreground">Certification And Trust Checks</h2>
              <p className="mt-2 text-sm text-muted-foreground">Use this quick checklist before finalizing any premium diamond purchase.</p>

              <ul className="mt-5 space-y-3">
                {[
                  "Validate report number and measurements against the stone.",
                  "Compare similar specs side-by-side before deciding.",
                  "Ask for full transparency on clarity and fluorescence.",
                  "Confirm return, upgrade, and after-sales support terms.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm text-foreground/85">
                  Want to verify a report instantly? Use our dedicated certificate checker before placing your final order.
                </p>
                <Button asChild variant="outline" className="mt-3">
                  <Link to="/certificate-verification">Go To Certificate Verification</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8">
            <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
              High-intent answers for buyers researching diamond quality, certification, and custom jewelry planning.
            </p>

            <Accordion type="single" collapsible className="mt-5">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="border-border">
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75">
              <Sparkles className="h-4 w-4" />
              Next Step
            </p>
            <h2 className="mt-2 font-heading text-3xl text-foreground">Move From Education To Selection</h2>
            <p className="mt-2 max-w-3xl text-sm text-foreground/75 sm:text-base">
              Start with certified loose diamonds or build your own design direction with VMORA experts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="luxury">
                <Link to="/diamonds">
                  Explore Loose Diamonds
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/design-line-up">
                  Visit Design Line Up
                  <ShieldCheck className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Education;
