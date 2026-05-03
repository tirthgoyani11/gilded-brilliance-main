import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin";

type CmsPayload = {
  title?: string;
  subtitle?: string;
  body?: string;
  posts?: string[];
  topics?: { title: string; body: string }[];
  items?: { id: string; title: string; type: string; summary: string; image?: string }[];
};

const defaultCms: Record<string, CmsPayload> = {
  about: {
    title: "About VMORA",
    body: "VMORA merges refined jewelry artistry with transparent diamond trading.",
  },
  blog: {
    title: "VMORA Journal",
    subtitle: "Editorial insight from our gemologists and design team.",
    posts: [],
  },
  education: {
    title: "Diamond Education",
    subtitle: "Master the 4Cs and buy with confidence.",
    topics: [],
  },
  designLineUp: {
    title: "Custom Jewelry and Watches Design Line Up",
    subtitle: "Curated custom concepts for jewelry and watches.",
    items: [],
  },
  brandStory: {
    title: "Where Vmora Precision Meets Passion",
    body: "Vmora curates exceptional diamonds and silver artistry with uncompromising standards.",
  },
};

const cmsKeys = ["about", "blog", "education", "designLineUp", "brandStory"] as const;
type CmsKey = (typeof cmsKeys)[number];

const AdminContent = () => {
  const [status, setStatus] = useState("");
  const [contents, setContents] = useState<Record<string, CmsPayload>>(defaultCms);
  const [activeKey, setActiveKey] = useState<CmsKey>("about");
  const [loading, setLoading] = useState(false);

  const cms = contents[activeKey] || {};

  const cmsTextarea = useMemo(() => {
    if (activeKey === "blog") {
      return (cms.posts || []).join("\n");
    }
    if (activeKey === "education") {
      return (cms.topics || []).map((t) => `${t.title}|${t.body}`).join("\n");
    }
    if (activeKey === "designLineUp") {
      return (cms.items || [])
        .map((item) => `${item.id}|${item.title}|${item.type}|${item.summary}|${item.image || ""}`)
        .join("\n");
    }
    return cms.body || "";
  }, [activeKey, cms]);

  const [cmsText, setCmsText] = useState("");

  useEffect(() => {
    setCmsText(cmsTextarea);
  }, [cmsTextarea]);

  const loadAll = async () => {
    setLoading(true);
    setStatus("");
    try {
      const contentRes = await adminFetch("/api/admin-content");

      if (contentRes.status === 401) {
        setStatus("Unauthorized: enter valid admin token.");
        return;
      }

      const contentJson = await contentRes.json();

      const next: Record<string, CmsPayload> = { ...defaultCms };
      if (Array.isArray(contentJson?.contents)) {
        for (const item of contentJson.contents) {
          if (item?.key) {
            next[item.key] = item.payload || {};
          }
        }
      }

      setContents(next);
      setStatus("Loaded admin-managed content.");
    } catch {
      setStatus("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const saveCms = async () => {
    const nextPayload: CmsPayload = {
      title: cms.title || "",
      subtitle: cms.subtitle || "",
    };

    if (activeKey === "about" || activeKey === "brandStory") {
      nextPayload.body = cmsText;
    } else if (activeKey === "blog") {
      nextPayload.posts = cmsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (activeKey === "education") {
      nextPayload.topics = cmsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, ...rest] = line.split("|");
          return { title: (title || "Topic").trim(), body: rest.join("|").trim() };
        });
    } else {
      nextPayload.items = cmsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
          const [id, title, type, summary, image] = line.split("|");
          return {
            id: (id || `item-${index + 1}`).trim(),
            title: (title || "Design Item").trim(),
            type: (type || "Custom Jewelry").trim(),
            summary: (summary || "").trim(),
            image: (image || "").trim() || undefined,
          };
        })
        .filter((item) => item.id && item.title && item.summary);
    }

    try {
      const response = await adminFetch("/api/admin-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: activeKey, payload: nextPayload }),
      });
      if (response.status === 401) {
        setStatus("Unauthorized: enter valid admin token.");
        return;
      }
      if (!response.ok) {
        setStatus("Failed to save content.");
        return;
      }

      setContents((prev) => ({ ...prev, [activeKey]: nextPayload }));
      setStatus(`${activeKey} content saved.`);
    } catch {
      setStatus("Failed to save content.");
    }
  };

  const deleteCms = async () => {
    try {
      const response = await adminFetch(`/api/admin-content?key=${activeKey}`, {
        method: "DELETE",
      });
      if (response.status === 401) {
        setStatus("Unauthorized: enter valid admin token.");
        return;
      }
      if (!response.ok) {
        setStatus("Failed to delete content.");
        return;
      }

      setContents((prev) => ({ ...prev, [activeKey]: defaultCms[activeKey] }));
      setStatus(`${activeKey} content deleted.`);
    } catch {
      setStatus("Failed to delete content.");
    }
  };

  return (
    <AdminLayout>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl">Admin Content Manager</h1>
            <p className="text-muted-foreground">Manage website content and jewelry listings.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => void loadAll()} disabled={loading}>Reload API Data</Button>
            {status ? <p className="text-sm text-primary">{status}</p> : null}
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <div className="rounded-[12px] border border-border p-5 bg-background space-y-3">
            <h2 className="font-heading text-xl">Page Content</h2>
            <div className="flex flex-wrap gap-2">
              {cmsKeys.map((key) => (
                <Button key={key} variant={activeKey === key ? "luxury" : "outline"} onClick={() => setActiveKey(key)}>
                  {key}
                </Button>
              ))}
            </div>
            <input
              value={cms.title || ""}
              onChange={(e) => setContents((prev) => ({ ...prev, [activeKey]: { ...(prev[activeKey] || {}), title: e.target.value } }))}
              placeholder="Title"
              className="w-full h-10 px-3 rounded border border-border bg-background"
            />
            <input
              value={cms.subtitle || ""}
              onChange={(e) => setContents((prev) => ({ ...prev, [activeKey]: { ...(prev[activeKey] || {}), subtitle: e.target.value } }))}
              placeholder="Subtitle"
              className="w-full h-10 px-3 rounded border border-border bg-background"
            />
            <textarea
              value={cmsText}
              onChange={(e) => setCmsText(e.target.value)}
              rows={10}
              className="w-full p-3 rounded border border-border bg-background"
              placeholder={
                activeKey === "education"
                  ? "One per line: Title|Body"
                  : activeKey === "blog"
                    ? "One blog post title per line"
                    : activeKey === "designLineUp"
                      ? "One per line: id|title|type|summary|image-url"
                      : "Body"
              }
            />
            <div className="flex gap-2">
              <Button onClick={() => void saveCms()}>Save {activeKey}</Button>
              <Button variant="destructive" onClick={() => void deleteCms()}>Delete {activeKey}</Button>
            </div>
          </div>

          <div className="rounded-[12px] border border-border p-5 bg-background space-y-3">
            <h2 className="font-heading text-xl">Product Catalog</h2>
            <p className="text-sm text-muted-foreground">
              Jewelry listings now live in a dedicated manager with richer fields, category filters, featured state,
              inventory status, and storefront publishing controls.
            </p>
            <Button asChild variant="luxury" className="w-full">
              <Link to="/admin/jewelry">Open Jewelry Listings</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/jewelry">Preview Storefront</Link>
            </Button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminContent;
