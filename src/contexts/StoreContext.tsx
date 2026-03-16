import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Diamond, RingBuilderSelection } from "@/types/diamond";
import { mockDiamonds } from "@/data/mockCatalog";

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
  importDiamonds: (items: Diamond[]) => Promise<{ total: number; created: number; updated: number }>;
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
  const [diamonds, setDiamonds] = useState<Diamond[]>(() => readStorage(STORAGE_KEYS.diamonds, mockDiamonds));
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage(STORAGE_KEYS.wishlist, []));
  const [compare, setCompare] = useState<Diamond[]>(() => readStorage(STORAGE_KEYS.compare, []));
  const [ringBuilder, setRingBuilderState] = useState<RingBuilderSelection>(() => readStorage(STORAGE_KEYS.ringBuilder, {}));

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.diamonds, JSON.stringify(diamonds));
  }, [diamonds]);

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

  const importDiamonds = async (items: Diamond[]) => {
    let created = 0;
    let updated = 0;

    setDiamonds((prev) => {
      const map = new Map(prev.map((item) => [item.stoneId, item]));
      items.forEach((item) => {
        if (map.has(item.stoneId)) updated += 1;
        else created += 1;
        map.set(item.stoneId, item);
      });
      return [...map.values()];
    });

    try {
      const response = await fetch("/api/import-diamonds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diamonds: items }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          total: Number(result.total ?? items.length),
          created: Number(result.created ?? created),
          updated: Number(result.updated ?? updated),
        };
      }
    } catch {
      // Keep local import as fallback when API is unavailable.
    }

    return { total: items.length, created, updated };
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
          setDiamonds(payload.diamonds as Diamond[]);
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
    setCompare((prev) => {
      if (prev.some((item) => item.stoneId === diamond.stoneId)) {
        return prev.filter((item) => item.stoneId !== diamond.stoneId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), diamond];
      }
      return [...prev, diamond];
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
