import { useEffect, useState } from "react";
import SiteLayout from "@/components/SiteLayout";

const topics = [
  { title: "Cut", body: "Cut quality defines light performance, fire, and scintillation." },
  { title: "Color", body: "Color grading ranges from colorless to faintly tinted stones." },
  { title: "Clarity", body: "Clarity evaluates internal and external characteristics." },
  { title: "Carat", body: "Carat measures diamond weight and influences rarity." },
];

const Education = () => {
  const [content, setContent] = useState({
    title: "Diamond Education",
    subtitle: "Master the 4Cs and buy with confidence.",
    topics,
  });

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content?key=education");
        if (!response.ok || !active) return;
        const payload = await response.json();
        const cms = payload?.content?.payload;
        if (cms && typeof cms === "object") {
          const nextTopics = Array.isArray(cms.topics)
            ? cms.topics
                .map((topic: { title?: unknown; body?: unknown }) => ({
                  title: String(topic?.title ?? "").trim(),
                  body: String(topic?.body ?? "").trim(),
                }))
                .filter((topic: { title: string; body: string }) => topic.title && topic.body)
            : null;

          setContent((prev) => ({
            title: typeof cms.title === "string" && cms.title.trim() ? cms.title : prev.title,
            subtitle: typeof cms.subtitle === "string" && cms.subtitle.trim() ? cms.subtitle : prev.subtitle,
            topics: nextTopics && nextTopics.length > 0 ? nextTopics : prev.topics,
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

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-2">{content.title}</h1>
        <p className="text-muted-foreground mb-8">{content.subtitle}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.topics.map((topic) => (
            <article key={topic.title} className="rounded-[12px] border border-border p-5 bg-secondary/30">
              <h2 className="font-heading text-xl mb-2">{topic.title}</h2>
              <p className="text-sm text-muted-foreground">{topic.body}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Education;
