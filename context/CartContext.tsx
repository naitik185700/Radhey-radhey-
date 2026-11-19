'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // unique item key
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<boolean>;
  isWishlisted: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('rr_cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
      const storedWishlist = localStorage.getItem('rr_wishlist');
      if (storedWishlist) {
        setWishlistIds(JSON.parse(storedWishlist));
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('rr_cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('rr_wishlist', JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isInitialized]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const itemKey = `${newItem.productId}-${newItem.variantId || 'std'}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemKey);
      if (existing) {
        const updatedQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock || 99);
        return prev.map((i) => (i.id === itemKey ? { ...i, quantity: updatedQty } : i));
      } else {
        return [...prev, { ...newItem, id: itemKey }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, i.maxStock || 99) } : i))
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    let newState = false;
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        newState = false;
        return prev.filter((id) => id !== productId);
      } else {
        newState = true;
        return [...prev, productId];
      }
    });

    // Optionally sync with server
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } catch (e) {}

    return newState;
  };

  const isWishlisted = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
