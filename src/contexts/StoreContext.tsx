import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Diamond, RingBuilderSelection } from "@/types/diamond";
import { mockDiamonds } from "@/data/mockCatalog";

const diamondStillImage = (stoneId: string) => `https://v3601514.v360.in/imaged/${encodeURIComponent(stoneId)}/still.jpg`;

const normalizeDiamondMedia = (diamond: Diamond): Diamond => {
  const normalizedStoneId = String(diamond.stoneId || "").trim() || "CD198-40";
  return {
    ...diamond,
    stoneId: normalizedStoneId,
    imageUrl: diamondStillImage(normalizedStoneId),
    v360StoneId: normalizedStoneId,
  };
};

const isValidDiamond = (item: unknown): item is Diamond => {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Partial<Diamond>;
  return (
    typeof candidate.stoneId === "string" &&
    candidate.stoneId.trim().length > 0 &&
    typeof candidate.carat === "number" &&
    Number.isFinite(candidate.carat) &&
    typeof candidate.price === "number" &&
    Number.isFinite(candidate.price)
  );
};

type ImportProgress = {
  totalChunks: number;
  completedChunks: number;
  persisted: number;
  failed: number;
};

type ImportOptions = {
  adminToken?: string;
  onProgress?: (progress: ImportProgress) => void;
};

type ImportResult = {
  total: number;
  created: number;
  updated: number;
  persisted: number;
  failed: number;
  failedItems: Diamond[];
};

const STORAGE_KEYS = {
  diamonds: "vmora_store_diamonds",
  cart: "vmora_store_cart",
  wishlist: "vmora_store_wishlist",
  compare: "vmora_store_compare",
  ringBuilder: "vmora_store_ring_builder",
};

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

interface StoreContextValue {
  diamonds: Diamond[];
  cart: CartItem[];
  wishlist: string[];
  compare: Diamond[];
  ringBuilder: RingBuilderSelection;
  importDiamonds: (items: Diamond[], options?: ImportOptions) => Promise<ImportResult>;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (stoneId: string) => void;
  isWishlisted: (stoneId: string) => boolean;
  toggleCompare: (diamond: Diamond) => void;
  isCompared: (stoneId: string) => boolean;
  setRingBuilder: (next: Partial<RingBuilderSelection>) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage(STORAGE_KEYS.wishlist, []));
  const [compare, setCompare] = useState<Diamond[]>(() => {
    const stored = readStorage<unknown[]>(STORAGE_KEYS.compare, []);
    if (!Array.isArray(stored)) return [];

    const byStoneId = new Map<string, Diamond>();
    for (const item of stored) {
      if (!isValidDiamond(item)) continue;
      const normalized = normalizeDiamondMedia(item);
      byStoneId.set(normalized.stoneId, normalized);
    }

    return [...byStoneId.values()].slice(-3);
  });
  const [ringBuilder, setRingBuilderState] = useState<RingBuilderSelection>(() => readStorage(STORAGE_KEYS.ringBuilder, {}));



  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compare));
  }, [compare]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.ringBuilder, JSON.stringify(ringBuilder));
  }, [ringBuilder]);

  const importDiamonds = async (items: Diamond[], options?: ImportOptions): Promise<ImportResult> => {
    let created = 0;
    let updated = 0;
    let persisted = 0;
    let failed = 0;
    const failedItems: Diamond[] = [];

    setDiamonds((prev) => {
      const map = new Map(prev.map((item) => [item.stoneId, item]));
      items.forEach((item) => {
        const normalized = normalizeDiamondMedia(item);
        if (map.has(item.stoneId)) updated += 1;
        else created += 1;
        map.set(item.stoneId, normalized);
      });
      return [...map.values()];
    });

    const chunkSize = 100;
    const chunks: Diamond[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }

    const totalChunks = chunks.length;
    let completedChunks = 0;

    const notifyProgress = () => {
      options?.onProgress?.({
        totalChunks,
        completedChunks,
        persisted,
        failed,
      });
    };

    notifyProgress();

    for (const chunk of chunks) {
      try {
        const response = await fetch("/api/import-diamonds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(options?.adminToken ? { "x-admin-token": options.adminToken } : {}),
          },
          body: JSON.stringify({ diamonds: chunk, source: "admin-excel-upload" }),
        });

        if (!response.ok) {
          failed += chunk.length;
          failedItems.push(...chunk);
          completedChunks += 1;
          notifyProgress();
          continue;
        }

        const result = await response.json();
        persisted += Number(result.total ?? chunk.length);
        completedChunks += 1;
        notifyProgress();
      } catch {
        failed += chunk.length;
        failedItems.push(...chunk);
        completedChunks += 1;
        notifyProgress();
      }
    }

    return { total: items.length, created, updated, persisted, failed, failedItems };
  };

  useEffect(() => {
    let active = true;

    const fetchDiamonds = async () => {
      try {
        const response = await fetch("/api/diamonds");
        if (!response.ok) return;
        const payload = await response.json();
        if (!active) return;
        if (Array.isArray(payload?.diamonds) && payload.diamonds.length > 0) {
          setDiamonds((payload.diamonds as Diamond[]).map(normalizeDiamondMedia));
        }
      } catch {
        // Fallback to local state when API is unavailable.
      }
    };

    void fetchDiamonds();

    return () => {
      active = false;
    };
  }, []);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (stoneId: string) => {
    setWishlist((prev) => (prev.includes(stoneId) ? prev.filter((id) => id !== stoneId) : [...prev, stoneId]));
  };

  const isWishlisted = (stoneId: string) => wishlist.includes(stoneId);

  const toggleCompare = (diamond: Diamond) => {
    const normalized = normalizeDiamondMedia(diamond);
    setCompare((prev) => {
      if (prev.some((item) => item.stoneId === normalized.stoneId)) {
        return prev.filter((item) => item.stoneId !== normalized.stoneId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), normalized];
      }
      return [...prev, normalized];
    });
  };

  const isCompared = (stoneId: string) => compare.some((item) => item.stoneId === stoneId);

  const setRingBuilder = (next: Partial<RingBuilderSelection>) => {
    setRingBuilderState((prev) => ({ ...prev, ...next }));
  };

  const value = useMemo(
    () => ({
      cart,
      diamonds,
      wishlist,
      compare,
      ringBuilder,
      importDiamonds,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      toggleCompare,
      isCompared,
      setRingBuilder,
    }),
    [cart, diamonds, wishlist, compare, ringBuilder],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};
