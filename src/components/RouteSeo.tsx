import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SeoEntry = {
  title: string;
  description: string;
  noindex?: boolean;
};

const SEO_BY_PATH: Record<string, SeoEntry> = {
  "/": {
    title: "VMORA | Certified Diamonds, Fine Jewelry, and Custom Luxury Design",
    description: "Explore certified loose diamonds, bespoke jewelry, and luxury watch creations from VMORA with transparent pricing and expert guidance.",
  },
  "/diamonds": {
    title: "Loose Diamonds | Certified Natural & Lab-Grown Diamonds | VMORA",
    description: "Browse certified loose diamonds by shape, color, clarity, carat, and price with transparent filters and premium guidance.",
  },
  "/education": {
    title: "Diamond Education Guide | 4Cs, Certification, and Buying Tips | VMORA",
    description: "Learn diamond cut, color, clarity, and carat with practical buying guidance and certification confidence from VMORA experts.",
  },
  "/certificate-verification": {
    title: "Certificate Verification | Verify Your Diamond Report | VMORA",
    description: "Verify diamond certification details quickly and confidently before you buy with VMORA certificate verification.",
  },
  "/about": {
    title: "About VMORA | Luxury Diamond House and Bespoke Design",
    description: "Discover VMORA's approach to certified diamond sourcing, bespoke craftsmanship, and transparent luxury buying experiences.",
  },
  "/design-line-up": {
    title: "Design Line Up | Bespoke Jewelry and Watch Concepts | VMORA",
    description: "Explore VMORA design concepts across rings, pendants, bracelets, earrings, and luxury watch projects.",
  },
  "/custom-jewelry-generator": {
    title: "Custom Jewelry Generator | Build Your Bespoke Concept | VMORA",
    description: "Create your custom jewelry concept by selecting style direction and diamond preferences with VMORA's bespoke workflow.",
  },
  "/blog": {
    title: "VMORA Blog | Diamond Insights and Luxury Jewelry Guidance",
    description: "Read practical insights on diamonds, certification, and premium jewelry decisions from VMORA.",
  },
  "/compare": {
    title: "Compare Diamonds | Side-by-Side Stone Comparison | VMORA",
    description: "Compare selected diamonds side-by-side by shape, carat, color, clarity, cut, and price.",
    noindex: true,
  },
  "/wishlist": {
    title: "Wishlist | Saved Diamond and Jewelry Picks | VMORA",
    description: "Review and manage your saved diamond and jewelry selections.",
    noindex: true,
  },
  "/cart": {
    title: "Cart | Review Your Selected Items | VMORA",
    description: "Review your selected items and proceed with your VMORA purchase flow.",
    noindex: true,
  },
  "/checkout": {
    title: "Checkout | Secure Order Completion | VMORA",
    description: "Securely complete your VMORA order with transparent fulfillment and support.",
    noindex: true,
  },
  "/account": {
    title: "My Account | Orders, Wishlist, and Preferences | VMORA",
    description: "Manage your account, order activity, and saved preferences.",
    noindex: true,
  },
};

const DEFAULT_SEO: SeoEntry = {
  title: "VMORA | Certified Diamonds & Fine Jewelry",
  description: "Discover certified diamonds, custom jewelry, and premium buying guidance from VMORA.",
};

const upsertMeta = (selector: string, attrs: Record<string, string>, content: string) => {
  let meta = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => meta?.setAttribute(key, value));
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", href);
};

const RouteSeo = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const dynamicDiamond: SeoEntry | null = path.startsWith("/diamond/")
      ? {
          title: "Diamond Details | Certified Stone Specifications | VMORA",
          description: "View detailed diamond specifications, media, and certification information before selection.",
        }
      : null;

    const matched = SEO_BY_PATH[path] || null;
    const seo: SeoEntry =
      dynamicDiamond ||
      matched ||
      (path.startsWith("/admin")
        ? {
            title: "VMORA",
            description: "Private administration route.",
            noindex: true,
          }
        : DEFAULT_SEO);

    const origin = window.location.origin || "https://www.vmorajewels.com";
    const canonicalUrl = `${origin}${path}${location.search || ""}`;

    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: "description" }, seo.description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, seo.title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, seo.description);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, seo.title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, seo.description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, seo.noindex ? "noindex, nofollow" : "index, follow");
    upsertCanonical(canonicalUrl);
  }, [location.pathname, location.search]);

  return null;
};

export default RouteSeo;
