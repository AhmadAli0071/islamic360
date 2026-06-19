import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface StatusEntry {
  status: string;
  comment: string;
  createdAt: string;
}

interface OrderItem {
  product: { _id: string; name: string; image: string; price: number };
  name: string;
  price: number;
  quantity: number;
}

interface TrackedOrder {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: string;
  statusHistory: StatusEntry[];
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderTracking({ language }: { language: 'en' | 'ur' }) {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Save push subscription with phone number for notifications
    if ('serviceWorker' in navigator && 'PushManager' in window && phone) {
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) api.savePhoneSubscription({ subscription: sub.toJSON(), phone }).catch(() => {});
        });
      });
    }
  }, [orders.length > 0]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      setOrders(await api.getOrdersByPhone(phone.trim()) as TrackedOrder[]);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 max-w-3xl mx-auto px-4 pb-16">
      <div className="text-center py-6">
        <div className="text-4xl mb-2">📦</div>
        <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)]">
          {language === 'en' ? 'Track Your Order' : 'اپنا آرڈر ٹریک کریں'}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {language === 'en' ? 'Enter your phone number to check order status' : 'آرڈر کی حیثیت دیکھنے کے لیے اپنا فون نمبر درج کریں'}
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder={language === 'en' ? 'Phone number (e.g. 03001234567)' : 'فون نمبر (مثلاً 03001234567)'}
          required
          className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button type="submit" className="px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
          {language === 'en' ? 'Track' : 'ٹریک کریں'}
        </button>
      </form>

      {loading && (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--text-secondary)] mt-3">{language === 'en' ? 'Searching...' : 'تلاش کر رہا ہے...'}</p>
        </div>
      )}

      {!loading && searched && orders.length === 0 && (
        <div className="text-center py-12 text-sm text-[var(--text-secondary)]">
          {language === 'en' ? 'No orders found for this number' : 'اس نمبر پر کوئی آرڈر نہیں ملا'}
        </div>
      )}

      {orders.map(order => (
        <div key={order._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
          {/* Order Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--text-secondary)]">{language === 'en' ? 'Order' : 'آرڈر'} #{order._id.toString().slice(-6)}</p>
              <p className="text-xs text-[var(--text-primary)] font-semibold">{order.customerName}</p>
              <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${STATUS_COLORS[order.status] || 'bg-gray-500'}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>

          {/* Items */}
          <div className="bg-[var(--background)] rounded-xl p-3 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{item.name}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">Rs.{item.price} × {item.quantity}</p>
                </div>
                <p className="text-xs font-bold">Rs.{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="border-t border-[var(--border)] pt-2 flex justify-between text-xs font-bold">
              <span>{language === 'en' ? 'Total' : 'کل'}</span>
              <span className="text-[var(--primary)] dark:text-[var(--secondary)]">Rs.{order.totalAmount}</span>
            </div>
          </div>

          {/* Address */}
          <div className="text-[11px] text-[var(--text-secondary)]">
            <span className="font-semibold">{language === 'en' ? 'Delivery:' : 'ڈیلیوری:'}</span> {order.customerAddress}
          </div>

          {/* Status Timeline */}
          <div className="space-y-0">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {language === 'en' ? 'Status Updates' : 'حیثیت میں تبدیلی'}
            </p>
            <div className="relative pl-6 space-y-0">
              {[...(order.statusHistory || [])].reverse().map((entry, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  {/* Timeline line */}
                  {i < ((order.statusHistory || []).length - 1) && (
                    <div className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-[var(--border)]" />
                  )}
                  {/* Dot */}
                  <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_COLORS[entry.status] || 'bg-gray-400'}`} />
                  {/* Content */}
                  <div className="pl-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${STATUS_COLORS[entry.status] ? 'text-' + STATUS_COLORS[entry.status].replace('bg-', '') : 'text-gray-500'}`}>
                        {STATUS_LABELS[entry.status] || entry.status}
                      </span>
                      <span className="text-[9px] text-gray-400">{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                    {entry.comment && (
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{entry.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
