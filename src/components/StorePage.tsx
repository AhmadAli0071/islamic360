import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StorePage({ language }: { language: 'en' | 'ur' }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('store_cart') || '[]'); } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    localStorage.setItem('store_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      setProducts(await api.getProducts() as Product[]);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      if (existing) return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.product._id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i =>
      i.product._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  };

  const totalAmount = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    try {
      await api.createOrder({
        items: cart.map(i => ({ product: i.product._id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
        totalAmount,
        customerName: checkoutName,
        customerPhone: checkoutPhone,
        customerAddress: checkoutAddress,
      });
      setPlaced(true);
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      setTimeout(() => setPlaced(false), 5000);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setPlacing(false);
    }
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)]">
            {language === 'en' ? 'Islamic 360 Store' : 'اسلامک 360 اسٹور'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {language === 'en' ? 'Premium Islamic products' : 'اعلیٰ اسلامی مصنوعات'}
          </p>
        </div>
        <button onClick={() => setShowCart(true)} className="relative px-3 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition flex items-center gap-1.5">
          🛒 {language === 'en' ? 'Cart' : 'کارٹ'}
          {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-64" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
          {language === 'en' ? 'No products yet. Coming soon!' : 'ابھی تک کوئی پروڈکٹ نہیں۔ جلد آرہی ہے!'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-md transition group">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden cursor-pointer" onClick={() => setSelectedImage(p.image || null)}>
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 dark:text-gray-600">📦</div>
                )}
              </div>
              <div className="p-3 space-y-1.5">
                <h3 className="text-xs font-bold text-[var(--text-primary)] leading-tight">{p.name}</h3>
                <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black text-[var(--primary)] dark:text-[var(--secondary)]">Rs.{p.price}</span>
                  <button onClick={() => addToCart(p)} className="px-2.5 py-1 bg-[var(--primary)] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[var(--primary-hover)] transition">
                    {language === 'en' ? 'Add' : 'شامل کریں'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" className="max-w-full max-h-full rounded-2xl object-contain" />
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setShowCart(false)}>
          <div className="w-full max-w-md bg-[var(--surface)] border-l border-[var(--border)] h-full overflow-y-auto shadow-2xl animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] p-4 flex items-center justify-between z-10">
              <h3 className="font-heading font-bold text-sm">{language === 'en' ? 'Your Cart' : 'آپ کی کارٹ'}</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-20 text-sm text-[var(--text-secondary)]">
                {language === 'en' ? 'Cart is empty' : 'کارٹ خالی ہے'}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {cart.map(i => (
                  <div key={i.product._id} className="flex items-center gap-3 bg-[var(--background)] rounded-xl p-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                      {i.product.image ? (
                        <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{i.product.name}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Rs.{i.product.price} × {i.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(i.product._id, -1)} className="w-6 h-6 rounded bg-[var(--border)] text-xs font-bold cursor-pointer hover:bg-gray-300">−</button>
                      <span className="w-6 text-center text-xs font-bold">{i.quantity}</span>
                      <button onClick={() => updateQty(i.product._id, 1)} className="w-6 h-6 rounded bg-[var(--border)] text-xs font-bold cursor-pointer hover:bg-gray-300">+</button>
                    </div>
                    <button onClick={() => removeFromCart(i.product._id)} className="text-red-400 hover:text-red-600 text-xs cursor-pointer">✕</button>
                  </div>
                ))}
                <div className="border-t border-[var(--border)] pt-3 space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{language === 'en' ? 'Total' : 'کل'}</span>
                    <span className="text-[var(--primary)] dark:text-[var(--secondary)]">Rs.{totalAmount}</span>
                  </div>
                  <button onClick={() => { setShowCheckout(true); }} className="w-full py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
                    {language === 'en' ? 'Proceed to Checkout' : 'آرڈر کریں'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
            <h3 className="font-heading font-bold text-sm mb-1">{language === 'en' ? 'Checkout' : 'آرڈر کی تصدیق'}</h3>
            <p className="text-[10px] text-[var(--text-secondary)] mb-4">
              {language === 'en' ? 'Cash on Delivery — Pay when you receive' : 'ڈیلیوری پر ادائیگی — وصول کرتے وقت ادا کریں'}
            </p>
            <form onSubmit={handlePlaceOrder} className="space-y-3">
              <input value={checkoutName} onChange={e => setCheckoutName(e.target.value)} placeholder={language === 'en' ? 'Full Name' : 'مکمل نام'} required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-400" />
              <input value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value)} placeholder={language === 'en' ? 'Phone Number' : 'فون نمبر'} required type="tel" className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-400" />
              <textarea value={checkoutAddress} onChange={e => setCheckoutAddress(e.target.value)} placeholder={language === 'en' ? 'Delivery Address' : 'ڈیلیوری ایڈریس'} required rows={3} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-400" />
              <div className="bg-[var(--background)] rounded-lg p-3 space-y-1">
                {cart.map(i => (
                  <div key={i.product._id} className="flex justify-between text-[10px]">
                    <span>{i.product.name} × {i.quantity}</span>
                    <span>Rs.{i.product.price * i.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-[var(--border)] pt-1 flex justify-between text-xs font-bold mt-1">
                  <span>{language === 'en' ? 'Total' : 'کل'}</span>
                  <span className="text-[var(--primary)] dark:text-[var(--secondary)]">Rs.{totalAmount}</span>
                </div>
              </div>
              <button type="submit" disabled={placing} className="w-full py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition disabled:opacity-50">
                {placing ? (language === 'en' ? 'Placing Order...' : 'آرڈر ہو رہا ہے...') : (language === 'en' ? 'Place Order (COD)' : 'آرڈر دیں (کوڈ)')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {placed && (
        <div className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto bg-emerald-800 text-amber-300 rounded-xl p-4 shadow-2xl border border-amber-500/20 text-xs font-semibold text-center animate-slideUp">
          ✅ {language === 'en' ? 'Order placed successfully! We will contact you soon.' : 'آرڈر کامیابی سے دیا گیا! ہم جلد آپ سے رابطہ کریں گے۔'}
        </div>
      )}
    </div>
  );
}
