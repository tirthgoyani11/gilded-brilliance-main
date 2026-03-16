import { useEffect, useMemo, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { adminFetch, clearAdminToken, getAdminToken, setAdminToken } from "@/lib/admin";

type CmsPayload = {
  title?: string;
  subtitle?: string;
  body?: string;
  posts?: string[];
  topics?: { title: string; body: string }[];
};

type JewelryAdminItem = {
  id: string;
  name: string;
  category: string;
  metal: string;
  price: number;
  imageUrl: string;
  description: string;
  isActive: boolean;
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
  brandStory: {
    title: "Where Vmora Precision Meets Passion",
    body: "Vmora curates exceptional diamonds and silver artistry with uncompromising standards.",
  },
};

const cmsKeys = ["about", "blog", "education", "brandStory"] as const;
type CmsKey = (typeof cmsKeys)[number];

const AdminContent = () => {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [contents, setContents] = useState<Record<string, CmsPayload>>(defaultCms);
  const [activeKey, setActiveKey] = useState<CmsKey>("about");
  const [jewelry, setJewelry] = useState<JewelryAdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<JewelryAdminItem>({
    id: "",
    name: "",
    category: "Rings",
    metal: "Silver",
    price: 0,
    imageUrl: "",
    description: "",
    isActive: true,
  });

  const cms = contents[activeKey] || {};

  const cmsTextarea = useMemo(() => {
    if (activeKey === "blog") {
      return (cms.posts || []).join("\n");
    }
    if (activeKey === "education") {
      return (cms.topics || []).map((t) => `${t.title}|${t.body}`).join("\n");
    }
    return cms.body || "";
  }, [activeKey, cms]);

  const [cmsText, setCmsText] = useState("");

  useEffect(() => {
    setToken(getAdminToken());
  }, []);

  useEffect(() => {
    setCmsText(cmsTextarea);
  }, [cmsTextarea]);

  const saveTokenValue = () => {
    setAdminToken(token);
    setStatus("Admin token saved.");
  };

  const clearTokenValue = () => {
    clearAdminToken();
    setToken("");
    setStatus("Admin token cleared.");
  };

  const loadAll = async () => {
    setLoading(true);
    setStatus("");
    try {
      const [contentRes, jewelryRes] = await Promise.all([
        adminFetch("/api/admin-content"),
        adminFetch("/api/admin-jewelry"),
      ]);

      if (contentRes.status === 401 || jewelryRes.status === 401) {
        setStatus("Unauthorized: enter valid admin token.");
        return;
      }

      const contentJson = await contentRes.json();
      const jewelryJson = await jewelryRes.json();

      const next: Record<string, CmsPayload> = { ...defaultCms };
      if (Array.isArray(contentJson?.contents)) {
        for (const item of contentJson.contents) {
          if (item?.key) {
            next[item.key] = item.payload || {};
          }
        }
      }
      setContents(next);
      setJewelry(Array.isArray(jewelryJson?.items) ? jewelryJson.items : []);
      setStatus("Loaded admin-managed content and jewelry.");
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

    if (activeKey === "about") {
      nextPayload.body = cmsText;
    } else if (activeKey === "blog") {
      nextPayload.posts = cmsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else {
      nextPayload.topics = cmsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, ...rest] = line.split("|");
          return { title: (title || "Topic").trim(), body: rest.join("|").trim() };
        });
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

  const saveJewelry = async () => {
    if (!form.id || !form.name || !form.imageUrl) {
      setStatus("Jewelry item requires id, name, and image URL.");
      return;
    }

    const exists = jewelry.some((item) => item.id === form.id);

    try {
      const response = await adminFetch("/api/admin-jewelry" + (exists ? "" : ""), {
        method: exists ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        setStatus("Unauthorized: enter valid admin token.");
        return;
      }

      if (!response.ok) {
        setStatus("Failed to save jewelry item.");
        return;
      }

      await loadAll();
      setForm({
        id: "",
        name: "",
        category: "Rings",
        metal: "Silver",
        price: 0,
        imageUrl: "",
        description: "",
        isActive: true,
      });
      setStatus("Jewelry saved.");
    } catch {
      setStatus("Failed to save jewelry item.");
    }
  };

  const deleteJewelry = async (id: string) => {
    try {
      const response = await adminFetch(`/api/admin-jewelry?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (response.status === 401) {
        setStatus("Unauthorized: enter valid admin token.");
        return;
      }
      if (!response.ok) {
        setStatus("Failed to delete jewelry item.");
        return;
      }
      await loadAll();
      setStatus("Jewelry deleted.");
    } catch {
      setStatus("Failed to delete jewelry item.");
    }
  };

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 space-y-6">
        <div>
          <h1 className="font-heading text-3xl">Admin Content Manager</h1>
          <p className="text-muted-foreground">Manage website content and jewelry listings without code edits.</p>
        </div>

        <div className="rounded-[12px] border border-border p-5 bg-secondary/20 space-y-3">
          <h2 className="font-heading text-xl">Admin Access</h2>
          <p className="text-sm text-muted-foreground">Default token: vmora-admin-2026 (change via ADMIN_TOKEN env in production).</p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter admin token"
              className="h-10 px-3 rounded border border-border bg-background min-w-[280px]"
            />
            <Button onClick={saveTokenValue}>Save Token</Button>
            <Button variant="outline" onClick={clearTokenValue}>Clear</Button>
            <Button variant="luxury-outline" onClick={() => void loadAll()} disabled={loading}>Reload</Button>
          </div>
          {status ? <p className="text-sm text-primary">{status}</p> : null}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
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
              placeholder={activeKey === "education" ? "One per line: Title|Body" : activeKey === "blog" ? "One blog post title per line" : "Body"}
            />
            <div className="flex gap-2">
              <Button onClick={() => void saveCms()}>Save {activeKey}</Button>
              <Button variant="destructive" onClick={() => void deleteCms()}>Delete {activeKey}</Button>
            </div>
          </div>

          <div className="rounded-[12px] border border-border p-5 bg-background space-y-3">
            <h2 className="font-heading text-xl">Jewelry Listings</h2>
            <p className="text-sm text-muted-foreground">Create, edit, and delete jewelry products manually.</p>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.id} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))} placeholder="ID" className="h-10 px-3 rounded border border-border bg-background" />
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="h-10 px-3 rounded border border-border bg-background" />
              <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" className="h-10 px-3 rounded border border-border bg-background" />
              <input value={form.metal} onChange={(e) => setForm((p) => ({ ...p, metal: e.target.value }))} placeholder="Metal" className="h-10 px-3 rounded border border-border bg-background" />
              <input value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) || 0 }))} placeholder="Price" className="h-10 px-3 rounded border border-border bg-background" />
              <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL" className="h-10 px-3 rounded border border-border bg-background" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Description" className="w-full p-3 rounded border border-border bg-background" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
              Active listing
            </label>
            <Button onClick={() => void saveJewelry()}>Save Jewelry</Button>

            <div className="max-h-[320px] overflow-auto space-y-2">
              {jewelry.map((item) => (
                <div key={item.id} className="rounded border border-border p-3 text-sm flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">{item.id} • {item.category} • {item.metal} • ${item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setForm(item)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => void deleteJewelry(item.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default AdminContent;
