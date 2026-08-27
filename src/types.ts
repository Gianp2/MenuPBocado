export type DietTag = 'destacado' | 'recomendado' | 'veggie' | 'compartir' | 'nuevo' | 'especial';

export interface MenuItemOption {
  name: string;
  priceDelta?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  image?: string;
  tags?: DietTag[];
  servesCount?: string; // e.g. "2 a 3 personas"
  ingredients?: string[];
  options?: {
    title: string;
    items: string[];
    required?: boolean;
  }[];
  variants?: {
    name: string;
    price: number;
    description?: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  shortName: string;
  subtitle: string;
  image?: string;
  accentColor?: string;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedVariant?: { name: string; price: number };
  selectedOptions?: Record<string, string>;
  notes?: string;
  totalPrice: number;
}

export interface OrderDetails {
  serviceType: 'mesa' | 'takeaway' | 'delivery';
  tableNumber?: string;
  customerName: string;
  customerPhone?: string;
  address?: string;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta';
  generalNotes?: string;
}
