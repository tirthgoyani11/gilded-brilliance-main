import SiteLayout from "@/components/SiteLayout";

const topics = [
  { title: "Cut", body: "Cut quality defines light performance, fire, and scintillation." },
  { title: "Color", body: "Color grading ranges from colorless to faintly tinted stones." },
  { title: "Clarity", body: "Clarity evaluates internal and external characteristics." },
  { title: "Carat", body: "Carat measures diamond weight and influences rarity." },
];

const Education = () => {
  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-2">Diamond Education</h1>
        <p className="text-muted-foreground mb-8">Master the 4Cs and buy with confidence.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {topics.map((topic) => (
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
