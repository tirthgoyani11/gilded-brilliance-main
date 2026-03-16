import SiteLayout from "@/components/SiteLayout";

const posts = [
  "How to Choose the Best Diamond Under 2 Carats",
  "IGI vs GIA: Certification Differences Explained",
  "Silver Jewelry Care for Everyday Luxury",
];

const Blog = () => {
  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-8">VMORA Journal</h1>
        <div className="grid md:grid-cols-3 gap-5">
          {posts.map((post) => (
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
