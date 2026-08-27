import {
  initializeApp,
  getApps,
  getApp,
} from 'firebase/app';

import { getAuth } from 'firebase/auth';

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

// ============================================================
// CONFIGURACIÓN FIREBASE
// ============================================================

export const firebaseConfig = {
  apiKey: 'AIzaSyBzsRupEaEtGrtvUlUU3nQYRm_EVnP6TDA',
  authDomain: 'restobar-874b6.firebaseapp.com',
  projectId: 'restobar-874b6',
  storageBucket: 'restobar-874b6.firebasestorage.app',
  messagingSenderId: '675722652631',
  appId: '1:675722652631:web:15ca2be413aebdc9e2f992',
  measurementId: 'G-CF5EM4QP0X',
};

// ============================================================
// INICIALIZAR FIREBASE
// ============================================================

export const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);

export const db: Firestore = getFirestore(app);

// ============================================================
// COLECCIONES
// ============================================================

export const CATEGORIES_COLLECTION = 'categories';

export const MENU_ITEMS_COLLECTION = 'menu_items';

export const RESTAURANT_COLLECTION = 'restaurant';

export const RESTAURANT_DOCUMENT = 'info';

// ============================================================
// REFERENCIAS
// ============================================================

export const categoriesRef = collection(
  db,
  CATEGORIES_COLLECTION
);

export const menuItemsRef = collection(
  db,
  MENU_ITEMS_COLLECTION
);

export const RESTAURANT_DOC_REF = doc(
  db,
  RESTAURANT_COLLECTION,
  RESTAURANT_DOCUMENT
);

// ============================================================
// TIPOS
// ============================================================

export interface FirebaseCategory {
  id: string;

  name: string;

  shortName?: string;

  icon?: string;

  subtitle?: string;

  accentColor?: string;

  image?: string;

  order?: number;

  active?: boolean;

  createdAt?: unknown;

  updatedAt?: unknown;
}

export interface FirebaseMenuItem {
  id: string;

  name: string;

  categoryId: string;

  description?: string;

  price: number;

  image?: string;

  tags?: string[];

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

  servesCount?: string;

  active?: boolean;

  order?: number;

  createdAt?: unknown;

  updatedAt?: unknown;
}

/**
 * Información del restaurante.
 *
 * Se utiliza un tipo flexible para permitir
 * que Firebase almacene cualquier campo adicional
 * que pueda necesitar el restaurante.
 */
export type RestaurantInfoData = {
  [key: string]: unknown;
};

// ============================================================
// CATEGORÍAS
// ============================================================

/**
 * Obtener todas las categorías.
 */
export async function getCategories(): Promise<
  FirebaseCategory[]
> {
  try {
    const snapshot = await getDocs(
      categoriesRef
    );

    return snapshot.docs.map(
      (document) => ({
        id: document.id,
        ...document.data(),
      })
    ) as FirebaseCategory[];
  } catch (error) {
    console.error(
      'Error obteniendo categorías:',
      error
    );

    return [];
  }
}

/**
 * Obtener una categoría por ID.
 */
export async function getCategory(
  id: string
): Promise<FirebaseCategory | null> {
  try {
    const categoryRef = doc(
      db,
      CATEGORIES_COLLECTION,
      id
    );

    const snapshot = await getDoc(
      categoryRef
    );

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as FirebaseCategory;
  } catch (error) {
    console.error(
      'Error obteniendo categoría:',
      error
    );

    return null;
  }
}

/**
 * Crear una categoría.
 */
export async function createCategory(
  category: Omit<FirebaseCategory, 'id'>
): Promise<string | null> {
  try {
    const categoryRef = doc(
      db,
      CATEGORIES_COLLECTION
    );

    await setDoc(
      categoryRef,
      {
        ...category,

        active:
          category.active ?? true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

    return categoryRef.id;
  } catch (error) {
    console.error(
      'Error creando categoría:',
      error
    );

    return null;
  }
}

/**
 * Crear una categoría utilizando un ID específico.
 *
 * Se utiliza para importar categorías
 * que ya existen en el código.
 */
export async function createCategoryWithId(
  id: string,
  category: Omit<FirebaseCategory, 'id'>
): Promise<boolean> {
  try {
    const categoryRef = doc(
      db,
      CATEGORIES_COLLECTION,
      id
    );

    await setDoc(
      categoryRef,
      {
        ...category,

        active:
          category.active ?? true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

    return true;
  } catch (error) {
    console.error(
      'Error creando categoría con ID:',
      error
    );

    return false;
  }
}

/**
 * Actualizar una categoría.
 */
export async function updateCategory(
  id: string,
  data: Partial<
    Omit<FirebaseCategory, 'id'>
  >
): Promise<boolean> {
  try {
    const categoryRef = doc(
      db,
      CATEGORIES_COLLECTION,
      id
    );

    await updateDoc(
      categoryRef,
      {
        ...data,

        updatedAt:
          serverTimestamp(),
      }
    );

    return true;
  } catch (error) {
    console.error(
      'Error actualizando categoría:',
      error
    );

    return false;
  }
}

/**
 * Eliminar una categoría.
 */
export async function deleteCategory(
  id: string
): Promise<boolean> {
  try {
    const categoryRef = doc(
      db,
      CATEGORIES_COLLECTION,
      id
    );

    await deleteDoc(
      categoryRef
    );

    return true;
  } catch (error) {
    console.error(
      'Error eliminando categoría:',
      error
    );

    return false;
  }
}

/**
 * Escuchar categorías en tiempo real.
 */
export function subscribeToCategories(
  callback: (
    categories: FirebaseCategory[]
  ) => void
): () => void {
  return onSnapshot(
    categoriesRef,

    (snapshot) => {
      const categories =
        snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data(),
          })
        ) as FirebaseCategory[];

      callback(categories);
    },

    (error) => {
      console.error(
        'Error escuchando categorías:',
        error
      );
    }
  );
}

// ============================================================
// PLATOS / MENU ITEMS
// ============================================================

/**
 * Obtener todos los platos.
 */
export async function getMenuItems(): Promise<
  FirebaseMenuItem[]
> {
  try {
    const snapshot = await getDocs(
      menuItemsRef
    );

    return snapshot.docs.map(
      (document) => ({
        id: document.id,
        ...document.data(),
      })
    ) as FirebaseMenuItem[];
  } catch (error) {
    console.error(
      'Error obteniendo platos:',
      error
    );

    return [];
  }
}

/**
 * Obtener un plato por ID.
 */
export async function getMenuItem(
  id: string
): Promise<FirebaseMenuItem | null> {
  try {
    const itemRef = doc(
      db,
      MENU_ITEMS_COLLECTION,
      id
    );

    const snapshot = await getDoc(
      itemRef
    );

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as FirebaseMenuItem;
  } catch (error) {
    console.error(
      'Error obteniendo plato:',
      error
    );

    return null;
  }
}

/**
 * Crear un plato.
 */
export async function createMenuItem(
  item: Omit<FirebaseMenuItem, 'id'>
): Promise<string | null> {
  try {
    const itemRef = doc(
      db,
      MENU_ITEMS_COLLECTION
    );

    await setDoc(
      itemRef,
      {
        ...item,

        price:
          Number(item.price) || 0,

        active:
          item.active ?? true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

    return itemRef.id;
  } catch (error) {
    console.error(
      'Error creando plato:',
      error
    );

    return null;
  }
}

/**
 * Crear un plato utilizando un ID específico.
 */
export async function createMenuItemWithId(
  id: string,
  item: Omit<FirebaseMenuItem, 'id'>
): Promise<boolean> {
  try {
    const itemRef = doc(
      db,
      MENU_ITEMS_COLLECTION,
      id
    );

    await setDoc(
      itemRef,
      {
        ...item,

        price:
          Number(item.price) || 0,

        active:
          item.active ?? true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

    return true;
  } catch (error) {
    console.error(
      'Error creando plato con ID:',
      error
    );

    return false;
  }
}

/**
 * Actualizar un plato.
 */
export async function updateMenuItem(
  id: string,
  data: Partial<
    Omit<FirebaseMenuItem, 'id'>
  >
): Promise<boolean> {
  try {
    const itemRef = doc(
      db,
      MENU_ITEMS_COLLECTION,
      id
    );

    const updatedData = {
      ...data,

      ...(data.price !== undefined
        ? {
            price:
              Number(data.price) || 0,
          }
        : {}),

      updatedAt:
        serverTimestamp(),
    };

    await updateDoc(
      itemRef,
      updatedData
    );

    return true;
  } catch (error) {
    console.error(
      'Error actualizando plato:',
      error
    );

    return false;
  }
}

/**
 * Eliminar un plato.
 */
export async function deleteMenuItem(
  id: string
): Promise<boolean> {
  try {
    const itemRef = doc(
      db,
      MENU_ITEMS_COLLECTION,
      id
    );

    await deleteDoc(
      itemRef
    );

    return true;
  } catch (error) {
    console.error(
      'Error eliminando plato:',
      error
    );

    return false;
  }
}

/**
 * Escuchar platos en tiempo real.
 */
export function subscribeToMenuItems(
  callback: (
    items: FirebaseMenuItem[]
  ) => void
): () => void {
  return onSnapshot(
    menuItemsRef,

    (snapshot) => {
      const items =
        snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data(),
          })
        ) as FirebaseMenuItem[];

      callback(items);
    },

    (error) => {
      console.error(
        'Error escuchando platos:',
        error
      );
    }
  );
}

// ============================================================
// MIGRACIÓN MASIVA
// ============================================================

/**
 * Guarda varias categorías de una sola vez.
 *
 * IMPORTANTE:
 * merge: true evita eliminar campos
 * existentes que no estén incluidos.
 */
export async function saveCategoriesBatch(
  categories: FirebaseCategory[]
): Promise<boolean> {
  try {
    const batch =
      writeBatch(db);

    categories.forEach(
      (category) => {
        const categoryRef =
          doc(
            db,
            CATEGORIES_COLLECTION,
            category.id
          );

        batch.set(
          categoryRef,
          {
            ...category,

            active:
              category.active ??
              true,

            updatedAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      }
    );

    await batch.commit();

    return true;
  } catch (error) {
    console.error(
      'Error guardando categorías:',
      error
    );

    return false;
  }
}

/**
 * Guarda varios platos de una sola vez.
 */
export async function saveMenuItemsBatch(
  items: FirebaseMenuItem[]
): Promise<boolean> {
  try {
    const batch =
      writeBatch(db);

    items.forEach(
      (item) => {
        const itemRef =
          doc(
            db,
            MENU_ITEMS_COLLECTION,
            item.id
          );

        batch.set(
          itemRef,
          {
            ...item,

            price:
              Number(item.price) || 0,

            active:
              item.active ??
              true,

            updatedAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      }
    );

    await batch.commit();

    return true;
  } catch (error) {
    console.error(
      'Error guardando platos:',
      error
    );

    return false;
  }
}

// ============================================================
// INFORMACIÓN DEL RESTAURANTE
// ============================================================

/**
 * Obtener información del restaurante.
 */
export async function getRestaurantInfo(): Promise<
  RestaurantInfoData | null
> {
  try {
    const snapshot =
      await getDoc(
        RESTAURANT_DOC_REF
      );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as RestaurantInfoData;
  } catch (error) {
    console.error(
      'Error obteniendo información del restaurante:',
      error
    );

    return null;
  }
}

/**
 * Escuchar información del restaurante
 * en tiempo real.
 *
 * Cada modificación realizada desde
 * el administrador será recibida automáticamente
 * por todos los clientes conectados.
 */
export function subscribeToRestaurantInfo(
  callback: (
    restaurant:
      | RestaurantInfoData
      | null
  ) => void
): () => void {
  return onSnapshot(
    RESTAURANT_DOC_REF,

    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback(
        snapshot.data() as RestaurantInfoData
      );
    },

    (error) => {
      console.error(
        'Error escuchando información del restaurante:',
        error
      );
    }
  );
}

/**
 * Guardar información del restaurante.
 */
export async function saveRestaurantInfo(
  data: object
): Promise<boolean> {
  try {
    await setDoc(
      RESTAURANT_DOC_REF,
      {
        ...data,

        updatedAt:
          serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    return true;
  } catch (error) {
    console.error(
      'Error guardando información del restaurante:',
      error
    );

    return false;
  }
}

// ============================================================
// COMPATIBILIDAD CON EL CÓDIGO ANTERIOR
// ============================================================

export interface CloudMenuPayload {
  categories?: FirebaseCategory[];

  menuItems?: FirebaseMenuItem[];

  restaurantInfo?:
    | RestaurantInfoData
    | null;

  pastaSauces?: string[];

  guarniciones?: string[];

  adminPassword?: string;

  updatedAt?: string;
}

/**
 * Función de compatibilidad
 * con el código anterior.
 *
 * Nueva estructura:
 *
 * categories
 * menu_items
 * restaurant
 *
 * en lugar de:
 *
 * restobar_data/menu_config
 */
export async function saveMenuToFirestore(
  data: CloudMenuPayload
): Promise<boolean> {
  try {
    if (
      data.categories &&
      data.categories.length > 0
    ) {
      await saveCategoriesBatch(
        data.categories
      );
    }

    if (
      data.menuItems &&
      data.menuItems.length > 0
    ) {
      await saveMenuItemsBatch(
        data.menuItems
      );
    }

    if (
      data.restaurantInfo
    ) {
      await saveRestaurantInfo(
        data.restaurantInfo
      );
    }

    return true;
  } catch (error) {
    console.error(
      'Error guardando datos del menú en Firestore:',
      error
    );

    return false;
  }
}