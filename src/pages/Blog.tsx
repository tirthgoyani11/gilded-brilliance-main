import { useEffect, useState } from "react";
import SiteLayout from "@/components/SiteLayout";

const posts = [
  "How to Choose the Best Diamond Under 2 Carats",
  "IGI vs GIA: Certification Differences Explained",
  "Silver Jewelry Care for Everyday Luxury",
];

const Blog = () => {
  const [content, setContent] = useState({
    title: "VMORA Journal",
    subtitle: "Editorial insight from our gemologists and design team.",
    posts,
  });

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content?key=blog");
        if (!response.ok || !active) return;
        const payload = await response.json();
        const cms = payload?.content?.payload;
        if (cms && typeof cms === "object") {
          setContent((prev) => ({
            title: typeof cms.title === "string" && cms.title.trim() ? cms.title : prev.title,
            subtitle: typeof cms.subtitle === "string" && cms.subtitle.trim() ? cms.subtitle : prev.subtitle,
            posts: Array.isArray(cms.posts) && cms.posts.length > 0 ? cms.posts.map(String) : prev.posts,
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
        <div className="grid md:grid-cols-3 gap-5">
          {content.posts.map((post) => (
            <article key={post} className="rounded-[12px] border border-border p-5 bg-secondary/30">
              <h2 className="font-heading text-xl mb-2">{post}</h2>
              <p className="text-sm text-muted-foreground">Editorial insight from our gemologists and design team.</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Blog;
