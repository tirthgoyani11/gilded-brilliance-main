import SiteLayout from "@/components/SiteLayout";

const About = () => {
  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 max-w-4xl">
        <h1 className="font-heading text-3xl mb-4">About VMORA</h1>
        <p className="text-muted-foreground leading-relaxed">
          VMORA merges refined jewelry artistry with transparent diamond trading. Every listed stone is selected for brilliance,
          verified through trusted laboratories, and presented with complete specification clarity.
        </p>
      </section>
    </SiteLayout>
  );
};

export default About;
