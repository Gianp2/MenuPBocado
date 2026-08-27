import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  Store,
  Bike,
  Utensils,
  CreditCard,
  Banknote,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { formatPrice, generateWhatsAppMessage, openWhatsApp } from '../utils/format';
import { RESTAURANT_INFO } from '../data/menuData';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface OrderCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  tableNumber: string;
  onSetTableNumber: (table: string) => void;
}

export const OrderCartModal: React.FC<OrderCartModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  tableNumber,
  onSetTableNumber,
}) => {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const [serviceType, setServiceType] = useState<'mesa' | 'takeaway' | 'delivery'>(
    tableNumber ? 'mesa' : 'mesa'
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('transferencia');
  const [generalNotes, setGeneralNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const currentOrderDetails: OrderDetails = {
    serviceType,
    tableNumber: serviceType === 'mesa' ? tableNumber : undefined,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    address: serviceType === 'delivery' ? address.trim() : undefined,
    paymentMethod,
    generalNotes: generalNotes.trim(),
  };

  const previewMessage = generateWhatsAppMessage(items, currentOrderDetails);

  const handleSendOrder = () => {
    if (items.length === 0) return;
    openWhatsApp(previewMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-xl bg-[#141418] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#18181f]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Tu Pedido</h2>
              <span className="text-xs text-zinc-400">
                {items.length} {items.length === 1 ? 'producto' : 'productos'} seleccionados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-all"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-white mb-1">Tu carrito está vacío</h3>
              <p className="text-xs text-zinc-400 max-w-xs mb-6">
                Recorre la carta digital y agrega los platos, sándwiches o picadas que más te gusten.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm active:scale-95 transition-transform"
              >
                Explorar la Carta
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider block">
                  Platos elegidos:
                </span>

                {items.map((cartItem) => (
                  <div
                    key={cartItem.cartItemId}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {cartItem.item.image ? (
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-500/80">
                            <Utensils className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">
                            {cartItem.item.name}
                          </h4>
                          {cartItem.selectedVariant && (
                            <span className="text-xs text-amber-400 font-medium block">
                              {cartItem.selectedVariant.name}
                            </span>
                          )}
                          <span className="text-xs text-zinc-400 font-bold">
                            {formatPrice(cartItem.totalPrice)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(cartItem.cartItemId)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar ítem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Custom Options Selected */}
                    {cartItem.selectedOptions && Object.keys(cartItem.selectedOptions).length > 0 && (
                      <div className="text-[11px] text-zinc-400 bg-black/30 rounded-lg p-2 space-y-0.5">
                        {Object.entries(cartItem.selectedOptions).map(([title, val]) => (
                          <div key={title} className="flex items-center gap-1">
                            <span className="text-zinc-500">{title}:</span>
                            <span className="text-zinc-300 font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notes if any */}
                    {cartItem.notes && (
                      <p className="text-[11px] text-amber-300/80 italic bg-amber-500/5 border border-amber-500/10 rounded-lg px-2 py-1">
                        "{cartItem.notes}"
                      </p>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-zinc-400">Cantidad:</span>
                      <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-white text-xs">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Type Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-zinc-400 tracking-wider block">
                  ¿Dónde vas a consumir?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('mesa')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                      serviceType === 'mesa'
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>En el Bar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('takeaway')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                      serviceType === 'takeaway'
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>Para Retirar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('delivery')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                      serviceType === 'delivery'
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Bike className="w-4 h-4 text-amber-400" />
                    <span>Delivery</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs based on Service */}
              {serviceType === 'mesa' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">Número de Mesa:</label>
                    <span className="text-[10px] text-zinc-500">¿Qué número dice tu mesa?</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ej: Mesa 7 o Barra"
                    value={tableNumber}
                    onChange={(e) => onSetTableNumber(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {serviceType === 'delivery' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 block">Dirección de entrega:</label>
                  <input
                    type="text"
                    placeholder="Calle, número, piso / dpto, entrecalles..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Tu Nombre (opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Lucas"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Teléfono de contacto:
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 11 2345-6789"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs uppercase font-bold text-zinc-400 tracking-wider block mb-2">
                  Forma de Pago preferida:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] font-medium gap-1 transition-all ${
                      paymentMethod === 'transferencia'
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Transferencia / MP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] font-medium gap-1 transition-all ${
                      paymentMethod === 'efectivo'
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] font-medium gap-1 transition-all ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tarjeta</span>
                  </button>
                </div>
              </div>

              {/* General Order Notes */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  Nota general para el bar / mozo (opcional):
                </label>
                <textarea
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Ej: Traer vasos extra con hielo, pagar con billete de $10.000..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 resize-none h-14"
                  maxLength={150}
                />
              </div>

              {/* WhatsApp Message Preview Toggle */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 font-medium transition-colors"
                >
                  {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPreview ? 'Ocultar vista previa de mensaje' : 'Ver mensaje que se enviará por WhatsApp'}</span>
                </button>

                {showPreview && (
                  <div className="mt-2.5 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {previewMessage}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#18181f] border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300 font-medium">Subtotal a abonar:</span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <button
              id="send-whatsapp-order-btn"
              onClick={handleSendOrder}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              <span>Enviar Pedido por WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
