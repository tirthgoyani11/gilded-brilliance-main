import { useEffect, useState } from "react";
import SiteLayout from "@/components/SiteLayout";

const About = () => {
  const [content, setContent] = useState({
    title: "About VMORA",
    body: "VMORA merges refined jewelry artistry with transparent diamond trading. Every listed stone is selected for brilliance, verified through trusted laboratories, and presented with complete specification clarity.",
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

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 max-w-4xl">
        <h1 className="font-heading text-3xl mb-4">{content.title}</h1>
        <p className="text-muted-foreground leading-relaxed">
          {content.body}
        </p>
      </section>
    </SiteLayout>
  );
};

export default About;
