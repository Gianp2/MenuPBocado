import { CartItem, OrderDetails } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppMessage(items: CartItem[], orderDetails: OrderDetails): string {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  let message = `👋 *¡Hola ${RESTAURANT_INFO.name}! Quisiera realizar un pedido:*\n\n`;

  if (orderDetails.serviceType === 'mesa') {
    message += `📍 *Servicio:* En el Bar - Mesa *#${orderDetails.tableNumber || 'A confirmar'}*\n`;
  } else if (orderDetails.serviceType === 'takeaway') {
    message += `🛍️ *Servicio:* Retiro por el Local (Take Away)\n`;
  } else {
    message += `🛵 *Servicio:* Envío a Domicilio (Delivery)\n`;
    if (orderDetails.address) {
      message += `🏠 *Dirección:* ${orderDetails.address}\n`;
    }
  }

  if (orderDetails.customerName) {
    message += `👤 *Cliente:* ${orderDetails.customerName}\n`;
  }
  if (orderDetails.customerPhone) {
    message += `📞 *Teléfono:* ${orderDetails.customerPhone}\n`;
  }

  message += `💳 *Método de Pago:* ${
    orderDetails.paymentMethod === 'efectivo'
      ? 'Efectivo'
      : orderDetails.paymentMethod === 'transferencia'
      ? 'Transferencia / Mercado Pago'
      : 'Tarjeta Débito/Crédito'
  }\n\n`;

  message += `📋 *DETALLE DEL PEDIDO:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;

  items.forEach((ci, idx) => {
    message += `${idx + 1}. *${ci.quantity}x* ${ci.item.name}`;
    if (ci.selectedVariant) {
      message += ` (${ci.selectedVariant.name})`;
    }
    message += ` - ${formatPrice(ci.totalPrice)}\n`;

    if (ci.selectedOptions && Object.keys(ci.selectedOptions).length > 0) {
      Object.entries(ci.selectedOptions).forEach(([title, val]) => {
        message += `   ▫️ _${title}:_ ${val}\n`;
      });
    }

    if (ci.notes) {
      message += `   📝 _Aclaración:_ "${ci.notes}"\n`;
    }
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL: ${formatPrice(total)}*\n\n`;

  if (orderDetails.generalNotes) {
    message += `📌 *Nota general:* ${orderDetails.generalNotes}\n\n`;
  }

  message += `_Pedido generado desde la Carta Digital de ${RESTAURANT_INFO.name}_ 📱✨`;

  return message;
}

export function openWhatsApp(message: string): void {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
