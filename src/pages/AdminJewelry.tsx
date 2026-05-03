import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Copy, Edit3, Eye, EyeOff, Plus, RotateCcw, Search, Sparkles, Trash2, Upload } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { adminFetch } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import type { JewelryItem } from "@/types/diamond";

const jewelryCategories = ["Rings", "Necklaces", "Bracelets", "Earrings"] as const;
const inventoryStatuses = ["In Stock", "Made To Order", "Reserved", "Sold Out"] as const;
const metals = ["Silver", "Gold", "Rose Gold", "White Gold"] as const;
const metalSwatches: Record<(typeof metals)[number], string> = {
  Silver: "#d8dde3",
  Gold: "#d4a943",
  "Rose Gold": "#c98c7a",
  "White Gold": "#f5f5f5",
};

type JewelryForm = JewelryItem & {
  subcategory: string;
  description: string;
  collection: string;
  stoneType: string;
  diamondWeight: string;
  setting: string;
  tags: string;
  metalImages: Record<(typeof metals)[number], string[]>;
  galleryImages: string[];
  pricing: Record<string, number>;
  videoUrl: string;
  modelUrl: string;
  inventoryStatus: "In Stock" | "Made To Order" | "Reserved" | "Sold Out";
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
};

const emptyForm: JewelryForm = {
  id: "",
  name: "",
  category: "Rings",
  subcategory: "",
  metal: "Silver",
  price: 0,
  imageUrl: "",
  description: "",
  collection: "",
  stoneType: "Natural Diamond",
  diamondWeight: "",
  setting: "",
  tags: "",
  metalImages: {
    Silver: [],
    Gold: [],
    "Rose Gold": [],
    "White Gold": [],
  },
  pricing: {},
  galleryImages: [],
  videoUrl: "",
  modelUrl: "",
  inventoryStatus: "In Stock",
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
};

const categoryDescriptions: Record<(typeof jewelryCategories)[number], string> = {
  Rings: "Engagement, wedding, eternity, stackable, cocktail, and fashion rings.",
  Necklaces: "Diamond pendants, tennis necklaces, chains, initials, and statement layers.",
  Bracelets: "Tennis bracelets, bangles, cuffs, stackable lines, and daily diamond essentials.",
  Earrings: "Studs, hoops, drops, huggies, solitaire pairs, and occasion earrings.",
};

const MEDIA_UPLOAD_ENDPOINT = "/api/admin-router?action=upload";

const parseUrlList = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const toUrlArray = (value: unknown, fallback = "") => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : fallback ? [fallback] : [];
  }
  return fallback ? [fallback] : [];
};

const pickPrimaryImage = (images: string[]) => images.find(Boolean) || "";

const toForm = (item: JewelryItem): JewelryForm => ({
  ...emptyForm,
  ...item,
  subcategory: item.subcategory || "",
  description: item.description || "",
  collection: item.collection || "",
  stoneType: item.stoneType || "",
  diamondWeight: item.diamondWeight || "",
  setting: item.setting || "",
  tags: item.tags || "",
  metalImages: {
    Silver: toUrlArray(item.metalImages?.Silver, item.imageUrl),
    Gold: toUrlArray(item.metalImages?.Gold, item.imageUrl),
    "Rose Gold": toUrlArray(item.metalImages?.["Rose Gold"], item.imageUrl),
  },
  galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : [],
  videoUrl: item.videoUrl || "",
  modelUrl: item.modelUrl || "",
  inventoryStatus: item.inventoryStatus || "In Stock",
  sortOrder: Number(item.sortOrder || 0),
  isFeatured: item.isFeatured === true,
  isActive: item.isActive !== false,
});

const createListingId = (name: string, category: string) => {
  const base = `${category}-${name || "jewelry"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 44);
  return `${base || "jewelry"}-${Date.now().toString(36)}`;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price || 0);

type LoadJewelryOptions = {
  category?: string;
  inventoryStatus?: string;
  query?: string;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/**
 * Smart image compressor — targets under 1MB while preserving jewelry detail.
 * Uses progressive quality reduction and resolution scaling.
 * Non-image files (GLB, video) pass through unchanged.
 */
const TARGET_SIZE = 1024 * 1024; // 1 MB

const compressImage = async (file: File): Promise<Blob> => {
  // Skip non-images (GLB models, videos, etc.)
  if (!file.type.startsWith("image/")) return file;

  // Already under 1MB — keep original for maximum quality
  if (file.size <= TARGET_SIZE) return file;

  // Load the image into a canvas
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context failed");

  // High-quality rendering for sharp jewelry facets and metal textures
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  /**
   * Compression passes — start with highest quality, progressively reduce.
   * Each pass tries a different resolution + quality combination.
   * The first result under 1MB wins.
   */
  const passes: Array<{ maxWidth: number; quality: number }> = [
    { maxWidth: 2048, quality: 0.92 }, // Best: 2K, near-lossless
    { maxWidth: 2048, quality: 0.85 }, // 2K, slight compression
    { maxWidth: 1600, quality: 0.85 }, // Reduced res, slight compression
    { maxWidth: 1600, quality: 0.78 }, // Reduced res, moderate compression
    { maxWidth: 1200, quality: 0.78 }, // Smaller, moderate compression
    { maxWidth: 1200, quality: 0.70 }, // Smallest acceptable for product photos
  ];

  for (const { maxWidth, quality } of passes) {
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    
    // Fill with white background first so transparent PNGs don't turn black when converted to JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Blob creation failed"))),
        "image/jpeg",
        quality,
      );
    });

    // First result under 1MB wins — preserves best possible quality
    if (blob.size <= TARGET_SIZE) {
      console.log(
        `Compressed: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(blob.size / 1024).toFixed(0)}KB (${width}×${height}, q=${quality})`,
      );
      return blob;
    }
  }

  // Final fallback — force smallest acceptable size
  canvas.width = Math.min(img.width, 1024);
  canvas.height = Math.round((img.height * canvas.width) / img.width);
  
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const finalBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Final compression failed"))),
      "image/jpeg",
      0.65,
    );
  });

  console.log(
    `Compressed (final): ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(finalBlob.size / 1024).toFixed(0)}KB`,
  );
  return finalBlob;
};

/**
 * Native browser video compressor.
 * Captures video frames to a canvas and encodes via MediaRecorder.
 * Runs in real-time (a 10s video takes 10s to compress) but drastically reduces size.
 */
const compressVideo = async (file: File, onProgress?: (msg: string) => void): Promise<Blob> => {
  if (!file.type.startsWith("video/")) return file;
  
  // Videos under 3MB are already small enough
  if (file.size <= 3 * 1024 * 1024) return file;

  return new Promise((resolve, reject) => {
    onProgress?.("Optimizing video...");
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas compression not supported"));

      // Target 800px max (perfect for web product loops) to save massive space
      const maxWidth = 800;
      let width = video.videoWidth;
      let height = video.videoHeight;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;

      video.play().catch(reject);

      // 24 FPS is cinematic standard and saves ~20% file size over 30 FPS
      const stream = canvas.captureStream(24);
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        // 500 Kbps target ensures a 20s video is ~1.2MB total
        videoBitsPerSecond: 500000, 
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        console.log(`Video compressed: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(blob.size / 1024 / 1024).toFixed(1)}MB`);
        // If compression somehow made it bigger or failed, return original (unlikely)
        resolve(blob.size < file.size ? blob : file);
      };

      recorder.start();

      const drawFrame = () => {
        if (video.paused || video.ended) {
          if (recorder.state === "recording") recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, width, height);
        
        // Update progress occasionally
        if (video.currentTime > 0 && Math.floor(video.currentTime * 10) % 10 === 0) {
           const pct = Math.round((video.currentTime / video.duration) * 100);
           onProgress?.(`Compressing video... ${pct}%`);
        }
        
        requestAnimationFrame(drawFrame);
      };

      video.onplay = () => drawFrame();
      video.onerror = reject;
      video.onended = () => {
        if (recorder.state === "recording") recorder.stop();
      };
    };
  });
};

const uploadFileToSupabase = async (file: File | Blob, folder: "images" | "models", originalName?: string) => {
  
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const fileName = originalName || (file instanceof File ? file.name : `upload-${Date.now()}.jpg`);
  const contentType = file.type || "image/jpeg";

  const response = await adminFetch(MEDIA_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataUrl,
      fileName,
      contentType,
      folder,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let payload = null;
    try { payload = JSON.parse(text); } catch { payload = { message: text || response.statusText }; }
    
    console.error("Upload Error:", payload);
    if (payload?.strategies) {
      console.error("%c⚠️ All upload strategies failed:", "color:#ff6b35;font-weight:bold;font-size:14px");
      payload.strategies.forEach((s: string) => console.error(`  → ${s}`));
      console.error(`%cBucket: "${payload.bucket}"`, "color:#4ecdc4;font-size:13px");
    }
    if (payload?.fix) {
      console.error("%c📋 FIX:", "color:#ff6b35;font-weight:bold", payload.fix);
    }

    const msg = payload?.message || "Upload failed";
    throw new Error(msg);
  }

  const payload = await response.json();
  const url = payload?.url ? String(payload.url) : "";
  const path = payload?.path ? String(payload.path) : "";
  const bucket = payload?.bucket ? String(payload.bucket) : "";

  if (!url && !path) {
    throw new Error("Supabase response missing URL");
  }

  return { url, path, bucket };
};

type PendingUpload = {
  file: Blob;
  folder: "images" | "models";
  originalName: string;
};

const AdminJewelry = () => {
  const [items, setItems] = useState<JewelryItem[]>([]);
  const [form, setForm] = useState<JewelryForm>(emptyForm);
  const [pendingUploads, setPendingUploads] = useState<Map<string, PendingUpload>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isEditing = useMemo(() => items.some((item) => item.id === form.id), [form.id, items]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }
    return counts;
  }, [items]);

  const featuredCount = useMemo(() => items.filter((item) => item.isFeatured).length, [items]);
  const activeCount = useMemo(() => items.filter((item) => item.isActive !== false).length, [items]);

  const loadJewelry = useCallback(async (options: LoadJewelryOptions = {}) => {
    const categoryFilter = options.category ?? "All";
    const statusFilter = options.inventoryStatus ?? "All";
    const searchFilter = options.query ?? "";

    setLoading(true);
    setStatus("");
    try {
      const url = new URL("/api/admin-router", window.location.origin);
      url.searchParams.set("action", "jewelry");
      if (categoryFilter !== "All") url.searchParams.set("category", categoryFilter);
      if (statusFilter !== "All") url.searchParams.set("status", statusFilter);
      if (searchFilter.trim()) url.searchParams.set("search", searchFilter.trim());

      const response = await adminFetch(url.toString());
      if (response.status === 401) {
        setStatus("Unauthorized: enter a valid admin token.");
        setItems([]);
        return;
      }
      if (!response.ok) {
        setStatus("Failed to load jewelry listings.");
        setItems([]);
        return;
      }

      const payload = await response.json();
      setItems(Array.isArray(payload?.items) ? payload.items : []);
    } catch {
      setStatus("Failed to load jewelry listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJewelry({ category: "All", inventoryStatus: "All", query: "" });
  }, [loadJewelry]);

  const resetForm = () => {
    setForm(emptyForm);
    setPendingUploads(new Map());
    setStatus("");
    setUploadProgress("");
  };

  const saveJewelry = async () => {
    const primarySilver = pickPrimaryImage(form.metalImages.Silver);
    const primaryGold = pickPrimaryImage(form.metalImages.Gold);
    const primaryRose = pickPrimaryImage(form.metalImages["Rose Gold"]);
    const nextForm = {
      ...form,
      id: form.id.trim() || createListingId(form.name, form.category),
      price: Number(form.price) || 0,
      sortOrder: Number(form.sortOrder) || 0,
      imageUrl: primarySilver || primaryGold || primaryRose || form.imageUrl,
    };

    if (!nextForm.name.trim()) {
      setStatus("Product name is required.");
      return;
    }

    if (metals.some((metal) => !nextForm.metalImages[metal]?.length)) {
      setStatus("Please add an image for Silver, Gold, and Rose Gold.");
      return;
    }

    setSaving(true);
    setStatus("");
    setUploadProgress("");

    try {
      // 1. Process all pending uploads before saving the database record
      if (pendingUploads.size > 0) {
        const uploadedUrls = new Map<string, string>();
        let currentUpload = 0;
        
        for (const [localBlobUrl, uploadData] of pendingUploads.entries()) {
          currentUpload++;
          setUploadProgress(`Uploading file ${currentUpload} of ${pendingUploads.size}...`);
          try {
            const res = await uploadFileToSupabase(uploadData.file, uploadData.folder, uploadData.originalName);
            uploadedUrls.set(localBlobUrl, res.url);
          } catch (err) {
            throw new Error(`Failed to upload ${uploadData.originalName}: ${err instanceof Error ? err.message : "Unknown error"}`);
          }
        }

        // Helper to replace local blob URLs with real Supabase URLs
        const replaceUrl = (url: string) => uploadedUrls.get(url) || url;

        nextForm.metalImages = {
          Silver: nextForm.metalImages.Silver.map(replaceUrl),
          Gold: nextForm.metalImages.Gold.map(replaceUrl),
          "Rose Gold": nextForm.metalImages["Rose Gold"].map(replaceUrl),
        };
        nextForm.galleryImages = nextForm.galleryImages.map(replaceUrl);
        nextForm.videoUrl = replaceUrl(nextForm.videoUrl);
        nextForm.modelUrl = replaceUrl(nextForm.modelUrl);
        nextForm.imageUrl = replaceUrl(nextForm.imageUrl);
        
        setPendingUploads(new Map());
        setUploadProgress("");
      }

      // 2. Save to database
      const exists = items.some((item) => item.id === nextForm.id);
      const response = await adminFetch("/api/admin-router?action=jewelry", {
        method: exists ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextForm),
      });

      if (response.status === 401) {
        setStatus("Unauthorized: enter a valid admin token.");
        return;
      }
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        console.error("Admin API Error Payload:", payload);
        const msg = payload?.message || payload?.error || response.statusText || "Failed to save jewelry listing.";
        const details = payload?.details || payload?.error || payload?.hint || "";
        setStatus(`${msg}${details ? `: ${details}` : ""}`);
        return;
      }

      setForm(emptyForm);
      setPendingUploads(new Map());
      setStatus(exists ? "Jewelry listing updated." : "Jewelry listing created.");
      await loadJewelry({ category: selectedCategory, inventoryStatus: selectedStatus, query: search });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save jewelry listing.");
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  };

  const deleteJewelry = async (item: JewelryItem) => {
    if (!window.confirm(`Delete ${item.name}? This cannot be undone.`)) return;

    try {
      const response = await adminFetch(`/api/admin-router?action=jewelry&id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setStatus("Failed to delete jewelry listing.");
        return;
      }
      setStatus("Jewelry listing deleted.");
      if (form.id === item.id) resetForm();
      await loadJewelry({ category: selectedCategory, inventoryStatus: selectedStatus, query: search });
    } catch {
      setStatus("Failed to delete jewelry listing.");
    }
  };

  const duplicateJewelry = (item: JewelryItem) => {
    setForm({
      ...toForm(item),
      id: createListingId(`${item.name} copy`, item.category),
      name: `${item.name} Copy`,
      isActive: false,
      isFeatured: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void loadJewelry({ category: selectedCategory, inventoryStatus: selectedStatus, query: search });
  };

  const queueUpload = (file: Blob, folder: "images" | "models", originalName: string) => {
    const url = URL.createObjectURL(file);
    setPendingUploads((prev) => {
      const next = new Map(prev);
      next.set(url, { file, folder, originalName });
      return next;
    });
    return url;
  };

  const handleMetalImageUpload = async (metal: (typeof metals)[number], files?: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      const newUrls = await Promise.all([...files].map(async (file) => {
        const compressed = file.type.startsWith("image/") ? await compressImage(file) : file;
        return queueUpload(compressed, "images", file.name);
      }));
      
      setForm((prev) => {
        const nextImages = [...prev.metalImages[metal], ...newUrls].filter(Boolean);
        return {
          ...prev,
          imageUrl: metal === "Silver" ? nextImages[0] || prev.imageUrl : prev.imageUrl,
          metalImages: {
            ...prev.metalImages,
            [metal]: nextImages,
          },
        };
      });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to process metal images.");
    }
  };

  const handleGalleryUpload = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      const newUrls = await Promise.all([...files].map(async (file) => {
        const compressed = file.type.startsWith("image/") ? await compressImage(file) : file;
        return queueUpload(compressed, "images", file.name);
      }));
      
      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newUrls],
      }));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to process gallery images.");
    }
  };

  const handleVideoUpload = async (file?: File) => {
    if (!file) return;
    try {
      setStatus("Preparing video...");
      const compressed = await compressVideo(file, setStatus);
      setStatus("Generating preview...");
      const videoPath = queueUpload(compressed, "images", file.name);
      setForm((prev) => ({ ...prev, videoUrl: videoPath }));
      setStatus("");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to process video.");
    }
  };

  const handleModelUpload = async (file?: File) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "glb" && ext !== "gltf") {
      setStatus("Please select a .glb or .gltf jewelry model.");
      return;
    }
    try {
      const modelPath = queueUpload(file, "models", file.name);
      setForm((prev) => ({ ...prev, modelUrl: modelPath }));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to process 360 model.");
    }
  };

  return (
    <AdminLayout>
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-4 w-4" />
              Fine Jewelry Catalog
            </p>
            <h1 className="font-heading text-3xl">Jewelry Listings</h1>
            <p className="max-w-3xl text-muted-foreground">
              Build a luxury catalog with Blue Nile-style categories: rings, necklaces, bracelets, and earrings.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void loadJewelry({ category: selectedCategory, inventoryStatus: selectedStatus, query: search })} disabled={loading}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={resetForm} variant="luxury">
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Button>
          </div>
        </div>

        {status || uploadProgress ? (
          <p className="rounded border border-border bg-secondary/30 p-3 text-sm text-primary">
            {uploadProgress || status}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {jewelryCategories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                void loadJewelry({ category, inventoryStatus: selectedStatus, query: search });
              }}
              className={`rounded-[12px] border p-4 text-left transition-colors ${
                selectedCategory === category ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-secondary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-heading text-xl">{category}</p>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  {categoryCounts.get(category) || 0}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{categoryDescriptions[category]}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-[12px] border border-border bg-background p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl">{isEditing ? "Edit Listing" : "Add Listing"}</h2>
                <p className="text-sm text-muted-foreground">Use polished product detail for premium buying decisions.</p>
              </div>
              {form.isActive ? <Eye className="h-5 w-5 text-primary" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
            </div>

            <div className="grid gap-3">
              <input value={form.id} onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))} placeholder="Listing ID, auto-generated when blank" className="h-10 rounded border border-border bg-background px-3 text-sm" />
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Product name" className="h-10 rounded border border-border bg-background px-3 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as JewelryForm["category"] }))} className="h-10 rounded border border-border bg-background px-3 text-sm">
                  {jewelryCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
                <input value={form.subcategory} onChange={(e) => setForm((prev) => ({ ...prev, subcategory: e.target.value }))} placeholder="Subcategory, e.g. Tennis" className="h-10 rounded border border-border bg-background px-3 text-sm" />
              </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Base Price</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))} placeholder="Base Price" className="h-10 rounded border border-border bg-background px-3 text-sm" />
                </div>
              </div>
              <div className="rounded-[10px] border border-border bg-secondary/20 p-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Pricing Per Purity (Optional)</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["10K", "14K", "18K", "22K"].map((purity) => (
                    <div key={purity} className="flex flex-col gap-1">
                       <label className="text-[10px] font-semibold text-muted-foreground">{purity} PRICE</label>
                       <input 
                         type="number" 
                         min="0" 
                         value={form.pricing?.[purity] || ""} 
                         onChange={(e) => {
                           const val = e.target.value;
                           setForm((prev) => {
                             const newPricing = { ...(prev.pricing || {}) };
                             if (val === "") {
                               delete newPricing[purity];
                             } else {
                               newPricing[purity] = Number(val);
                             }
                             return { ...prev, pricing: newPricing };
                           });
                         }} 
                         placeholder="Auto (Uses Base)" 
                         className="h-9 rounded border border-border bg-background px-3 text-sm" 
                       />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[10px] border border-border bg-secondary/20 p-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Metal color images</p>
                <div className="grid gap-3">
                  {metals.map((metal) => (
                    <div key={metal} className="rounded border border-border bg-background p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: metalSwatches[metal] }} />
                        <p className="text-sm font-medium">{metal}</p>
                      </div>
                      <div className="grid gap-2">
                        <textarea
                          value={form.metalImages[metal].join("\n")}
                          onChange={(e) => {
                            const images = parseUrlList(e.target.value);
                            setForm((prev) => ({
                              ...prev,
                              imageUrl: metal === "Silver" ? images[0] || prev.imageUrl : prev.imageUrl,
                              metalImages: { ...prev.metalImages, [metal]: images },
                            }));
                          }}
                          rows={2}
                          placeholder={`${metal} image URLs (one per line) or upload files`}
                          className="min-h-[80px] w-full rounded border border-border bg-background px-3 py-2 text-sm"
                        />
                        <label className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded border border-border px-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">
                          <Upload className="h-4 w-4" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => void handleMetalImageUpload(metal, e.target.files)}
                          />
                        </label>
                      </div>
                      {form.metalImages[metal].length > 0 ? (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {form.metalImages[metal].map((image, index) => (
                            <div key={`${image}-${index}`} className="group relative">
                              <img src={image} alt={`${metal} ${index + 1}`} className="h-20 w-full rounded border border-border object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setForm((prev) => {
                                    const nextImages = prev.metalImages[metal].filter((_, idx) => idx !== index);
                                    return {
                                      ...prev,
                                      imageUrl: metal === "Silver" ? nextImages[0] || prev.imageUrl : prev.imageUrl,
                                      metalImages: { ...prev.metalImages, [metal]: nextImages },
                                    };
                                  });
                                }}
                                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100"
                                aria-label={`Remove ${metal} image ${index + 1}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Description" className="rounded border border-border bg-background p-3 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input list="collections" value={form.collection} onChange={(e) => setForm((prev) => ({ ...prev, collection: e.target.value }))} placeholder="Collection" className="w-full h-10 rounded border border-border bg-background px-3 text-sm" />
                  <datalist id="collections">
                    <option value="Bridal Collection" />
                    <option value="Everyday Essentials" />
                    <option value="High Jewelry" />
                    <option value="Tennis Collection" />
                  </datalist>
                </div>
                <div>
                  <input list="stone-types" value={form.stoneType} onChange={(e) => setForm((prev) => ({ ...prev, stoneType: e.target.value }))} placeholder="Stone type" className="w-full h-10 rounded border border-border bg-background px-3 text-sm" />
                  <datalist id="stone-types">
                    <option value="Natural Diamond" />
                    <option value="Lab Grown Diamond" />
                    <option value="Moissanite" />
                    <option value="Sapphire" />
                    <option value="Ruby" />
                    <option value="Emerald" />
                    <option value="No Stone" />
                  </datalist>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.diamondWeight} onChange={(e) => setForm((prev) => ({ ...prev, diamondWeight: e.target.value }))} placeholder="Diamond weight, e.g. 1.20 ctw" className="h-10 rounded border border-border bg-background px-3 text-sm" />
                <div>
                  <input list="settings" value={form.setting} onChange={(e) => setForm((prev) => ({ ...prev, setting: e.target.value }))} placeholder="Setting / style" className="w-full h-10 rounded border border-border bg-background px-3 text-sm" />
                  <datalist id="settings">
                    <option value="Solitaire" />
                    <option value="Halo" />
                    <option value="Hidden Halo" />
                    <option value="Pave" />
                    <option value="Prong" />
                    <option value="Bezel" />
                    <option value="Three-Stone" />
                  </datalist>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.inventoryStatus} onChange={(e) => setForm((prev) => ({ ...prev, inventoryStatus: e.target.value as JewelryForm["inventoryStatus"] }))} className="h-10 rounded border border-border bg-background px-3 text-sm">
                  {inventoryStatuses.map((item) => <option key={item}>{item}</option>)}
                </select>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))} placeholder="Sort order" className="h-10 rounded border border-border bg-background px-3 text-sm" />
              </div>
              <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="Tags, e.g. best-seller, bridal, gift" className="h-10 rounded border border-border bg-background px-3 text-sm" />
              <div className="rounded-[10px] border border-border bg-secondary/20 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Extra gallery images</p>
                  <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded border border-border bg-background px-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">
                    <Upload className="h-4 w-4" />
                    Upload
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => void handleGalleryUpload(e.target.files)} />
                  </label>
                </div>
                {form.galleryImages.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {form.galleryImages.slice(0, 6).map((image, index) => (
                      <img key={`${image}-${index}`} src={image} alt={`Gallery ${index + 1}`} className="h-16 w-full rounded border border-border object-cover" />
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="rounded-[10px] border border-border bg-secondary/20 p-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Product video</p>
                <div className="flex gap-2">
                  <input
                    value={form.videoUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="Video URL or uploaded video"
                    className="h-10 min-w-0 flex-1 rounded border border-border bg-background px-3 text-sm"
                  />
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded border border-border bg-background px-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">
                    <Upload className="h-4 w-4" />
                    Upload
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => void handleVideoUpload(e.target.files?.[0])} />
                  </label>
                </div>
              </div>
              <div className="rounded-[10px] border border-border bg-secondary/20 p-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">360 jewelry model</p>
                <div className="flex gap-2">
                  <input
                    value={form.modelUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, modelUrl: e.target.value }))}
                    placeholder="GLB/GLTF URL or uploaded 360 model"
                    className="h-10 min-w-0 flex-1 rounded border border-border bg-background px-3 text-sm"
                  />
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded border border-border bg-background px-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">
                    <Upload className="h-4 w-4" />
                    Upload
                    <input type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" className="hidden" onChange={(e) => void handleModelUpload(e.target.files?.[0])} />
                  </label>
                </div>
                {form.modelUrl ? (
                  <p className="mt-2 text-xs text-primary">360 model attached. Customers will see an interactive 360 view.</p>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">Optional: upload a compressed .glb for best mobile performance.</p>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
                  Active on website
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))} />
                  Featured
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="luxury" onClick={() => void saveJewelry()} disabled={saving}>
                  {saving ? "Processing..." : isEditing ? "Update Listing" : "Save Listing"}
                </Button>
                <Button variant="outline" onClick={resetForm}>Clear</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 rounded-[12px] border border-border bg-background p-4 lg:grid-cols-[1fr_180px_170px]">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, metal, collection, tags..." className="h-10 w-full rounded border border-border bg-background pl-9 pr-3 text-sm" />
              </form>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                <option>All</option>
                {jewelryCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                <option>All</option>
                {inventoryStatuses.map((item) => <option key={item}>{item}</option>)}
              </select>
              <div className="flex gap-2 lg:col-span-3">
                <Button type="button" onClick={() => void loadJewelry({ category: selectedCategory, inventoryStatus: selectedStatus, query: search })} className="h-10">Apply Filters</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                    void loadJewelry({ category: "All", inventoryStatus: "All", query: "" });
                  }}
                  className="h-10"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[12px] border border-border bg-secondary/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Total</p>
                <p className="font-heading text-3xl">{items.length}</p>
              </div>
              <div className="rounded-[12px] border border-border bg-secondary/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Active</p>
                <p className="font-heading text-3xl">{activeCount}</p>
              </div>
              <div className="rounded-[12px] border border-border bg-secondary/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Featured</p>
                <p className="font-heading text-3xl">{featuredCount}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[12px] border border-border bg-background">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Details</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading jewelry listings...</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No jewelry listings found.</td></tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded border border-border object-cover" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{item.name}</p>
                                  {item.isFeatured ? <BadgeCheck className="h-4 w-4 text-primary" /> : null}
                                </div>
                                <p className="text-xs text-muted-foreground">{item.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p>{item.category}</p>
                            <p className="text-xs text-muted-foreground">{item.subcategory || item.collection || "Fine jewelry"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p>{item.metal}</p>
                            <p className="text-xs text-muted-foreground">{item.inventoryStatus || "In Stock"}{item.diamondWeight ? ` • ${item.diamondWeight}` : ""}{item.modelUrl ? " • 360" : ""}</p>
                          </td>
                          <td className="px-4 py-3 font-medium">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => { setForm(toForm(item)); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => duplicateJewelry(item)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => void deleteJewelry(item)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminJewelry;
