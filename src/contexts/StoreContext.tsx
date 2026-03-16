import { createContext, useContext, useMemo, useState } from "react";
import type { CartItem, Diamond, RingBuilderSelection } from "@/types/diamond";

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  compare: Diamond[];
  ringBuilder: RingBuilderSelection;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<Diamond[]>([]);
  const [ringBuilder, setRingBuilderState] = useState<RingBuilderSelection>({});

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
      wishlist,
      compare,
      ringBuilder,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      toggleCompare,
      isCompared,
      setRingBuilder,
    }),
    [cart, wishlist, compare, ringBuilder],
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
