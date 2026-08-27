import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { onAuthStateChanged } from 'firebase/auth';

import { Category, MenuItem } from '../types';

import {
  CATEGORIES as INITIAL_CATEGORIES,
  MENU_ITEMS as INITIAL_MENU_ITEMS,
  RESTAURANT_INFO as INITIAL_RESTAURANT_INFO,
  PASTA_SAUCES as INITIAL_PASTA_SAUCES,
  GUARNICIONES as INITIAL_GUARNICIONES,
} from '../data/menuData';

import {
  subscribeToCategories,
  subscribeToMenuItems,
  subscribeToRestaurantInfo,
  createCategoryWithId,
  updateCategory as updateCategoryInFirestore,
  deleteCategory as deleteCategoryFromFirestore,
  createMenuItemWithId,
  updateMenuItem as updateMenuItemInFirestore,
  deleteMenuItem as deleteMenuItemFromFirestore,
  saveCategoriesBatch,
  saveMenuItemsBatch,
  saveRestaurantInfo,
  auth,
} from '../lib/firebase';

/* ============================================================
   TIPOS
============================================================ */

export interface RestaurantInfoType {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  instagram: string;
  hours: string;
  wifi: {
    network: string;
    password: string;
  };
}

interface MenuContextType {
  categories: Category[];
  menuItems: MenuItem[];
  restaurantInfo: RestaurantInfoType;
  pastaSauces: string[];
  guarniciones: string[];

  isAdminOpen: boolean;
  isAdminLoggedIn: boolean;

  isFirebaseSyncing: boolean;
  isFirebaseConnected: boolean;

  setIsAdminOpen: (open: boolean) => void;
  setIsAdminLoggedIn: (logged: boolean) => void;

  addItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateItem: (id: string, updated: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => MenuItem | null;
  bulkUpdatePrices: (percentage: number, categoryId?: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (fromIndex: number, toIndex: number) => void;

  setPastaSauces: (sauces: string[]) => void;
  addPastaSauce: (sauce: string) => void;
  removePastaSauce: (index: number) => void;

  setGuarniciones: (sides: string[]) => void;
  addGuarnicion: (side: string) => void;
  removeGuarnicion: (index: number) => void;

  updateRestaurantInfo: (
    info: Partial<RestaurantInfoType>
  ) => void;

  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;

  syncToCloudNow: () => Promise<boolean>;
}

/* ============================================================
   STORAGE
============================================================ */

const STORAGE_KEYS = {
  CATEGORIES: 'pb_menu_categories_v1',
  MENU_ITEMS: 'pb_menu_items_v1',
  RESTAURANT_INFO: 'pb_restaurant_info_v1',
  PASTA_SAUCES: 'pb_pasta_sauces_v1',
  GUARNICIONES: 'pb_guarniciones_v1',
  ADMIN_AUTH: 'pb_admin_auth_v1',
};

/* ============================================================
   CONTEXT
============================================================ */

const MenuContext = createContext<
  MenuContextType | undefined
>(undefined);

/* ============================================================
   NORMALIZADORES
============================================================ */

const normalizeCategory = (
  category: Partial<Category> & {
    id?: unknown;
    name?: unknown;
    shortName?: unknown;
    icon?: unknown;
    subtitle?: unknown;
    image?: unknown;
    accentColor?: unknown;
  }
): Category => ({
  id: String(category.id ?? ''),
  name: String(category.name ?? ''),
  icon: String(category.icon ?? ''),
  shortName: String(
    category.shortName ??
      category.name ??
      ''
  ),
  subtitle: String(category.subtitle ?? ''),
  image:
    typeof category.image === 'string'
      ? category.image
      : undefined,
  accentColor:
    typeof category.accentColor === 'string'
      ? category.accentColor
      : undefined,
});

const normalizeMenuItem = (
  item: Omit<Partial<MenuItem>, 'tags'> & {
    id?: unknown;
    name?: unknown;
    categoryId?: unknown;
    description?: unknown;
    price?: unknown;
    image?: unknown;
    tags?: unknown;
    servesCount?: unknown;
    ingredients?: unknown;
    options?: unknown;
    variants?: unknown;
  }
): MenuItem => ({
  id: String(item.id ?? ''),
  name: String(item.name ?? ''),
  categoryId: String(item.categoryId ?? ''),
  description: String(item.description ?? ''),
  price: Number(item.price ?? 0),

  image:
    typeof item.image === 'string'
      ? item.image
      : undefined,

  tags: Array.isArray(item.tags)
    ? (item.tags as MenuItem['tags'])
    : undefined,

  servesCount:
    typeof item.servesCount === 'string'
      ? item.servesCount
      : undefined,

  ingredients: Array.isArray(
    item.ingredients
  )
    ? (item.ingredients as string[])
    : undefined,

  options: Array.isArray(item.options)
    ? item.options
    : undefined,

  variants: Array.isArray(item.variants)
    ? item.variants
    : undefined,
});

const normalizeRestaurantInfo = (
  data:
    | Record<string, unknown>
    | null
    | undefined
): RestaurantInfoType => {
  const source = data ?? {};

  const wifiSource =
    typeof source.wifi === 'object' &&
    source.wifi !== null
      ? (source.wifi as Record<string, unknown>)
      : {};

  return {
    name: String(source.name ?? ''),
    tagline: String(source.tagline ?? ''),
    description: String(
      source.description ?? ''
    ),
    address: String(source.address ?? ''),
    phone: String(source.phone ?? ''),
    whatsappNumber: String(
      source.whatsappNumber ?? ''
    ),
    instagram: String(
      source.instagram ?? ''
    ),
    hours: String(source.hours ?? ''),
    wifi: {
      network: String(
        wifiSource.network ?? ''
      ),
      password: String(
        wifiSource.password ?? ''
      ),
    },
  };
};

const getInitialRestaurantInfo =
  (): RestaurantInfoType => {
    return normalizeRestaurantInfo(
      INITIAL_RESTAURANT_INFO as unknown as Record<
        string,
        unknown
      >
    );
  };

/* ============================================================
   PROVIDER
============================================================ */

export const MenuProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [categories, setCategories] =
    useState<Category[]>(
      INITIAL_CATEGORIES
    );

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(
      INITIAL_MENU_ITEMS
    );

  const [restaurantInfo, setRestaurantInfo] =
    useState<RestaurantInfoType>(
      getInitialRestaurantInfo()
    );

  const [
    pastaSauces,
    setPastaSaucesState,
  ] = useState<string[]>(
    INITIAL_PASTA_SAUCES
  );

  const [
    guarniciones,
    setGuarnicionesState,
  ] = useState<string[]>(
    INITIAL_GUARNICIONES
  );

  const [isAdminOpen, setIsAdminOpen] =
    useState(false);

  const [
    isAdminLoggedIn,
    setIsAdminLoggedInState,
  ] = useState<boolean>(() => {
    return (
      sessionStorage.getItem(
        STORAGE_KEYS.ADMIN_AUTH
      ) === 'true'
    );
  });

  const [
    isFirebaseConnected,
    setIsFirebaseConnected,
  ] = useState(false);

  const [
    isFirebaseSyncing,
    setIsFirebaseSyncing,
  ] = useState(false);

  const firebaseInitializedRef =
    useRef(false);

  const categoriesReceivedRef =
    useRef(false);

  const menuItemsReceivedRef =
    useRef(false);

  const restaurantReceivedRef =
    useRef(false);

  /* ============================================================
     AUTH
  ============================================================ */

  const setIsAdminLoggedIn = (
    logged: boolean
  ) => {
    setIsAdminLoggedInState(logged);

    if (logged) {
      sessionStorage.setItem(
        STORAGE_KEYS.ADMIN_AUTH,
        'true'
      );
    } else {
      sessionStorage.removeItem(
        STORAGE_KEYS.ADMIN_AUTH
      );
    }
  };

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            setIsAdminLoggedInState(true);

            sessionStorage.setItem(
              STORAGE_KEYS.ADMIN_AUTH,
              'true'
            );
          } else {
            setIsAdminLoggedInState(false);

            sessionStorage.removeItem(
              STORAGE_KEYS.ADMIN_AUTH
            );
          }
        }
      );

    return () => unsubscribe();
  }, []);

  /* ============================================================
     LOCAL STORAGE
  ============================================================ */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CATEGORIES,
        JSON.stringify(categories)
      );
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.MENU_ITEMS,
        JSON.stringify(menuItems)
      );
    } catch {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.RESTAURANT_INFO,
        JSON.stringify(restaurantInfo)
      );
    } catch {}
  }, [restaurantInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PASTA_SAUCES,
        JSON.stringify(pastaSauces)
      );
    } catch {}
  }, [pastaSauces]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.GUARNICIONES,
        JSON.stringify(guarniciones)
      );
    } catch {}
  }, [guarniciones]);

  /* ============================================================
     FIREBASE - SUSCRIPCIONES
  ============================================================ */

  useEffect(() => {
    let unsubscribeCategories:
      | (() => void)
      | undefined;

    let unsubscribeMenuItems:
      | (() => void)
      | undefined;

    let unsubscribeRestaurant:
      | (() => void)
      | undefined;

    const initializeFirebase = () => {
      try {
        unsubscribeCategories =
          subscribeToCategories(
            (firebaseCategories) => {
              categoriesReceivedRef.current =
                true;

              if (
                firebaseCategories.length >
                0
              ) {
                const normalized =
                  firebaseCategories
                    .filter(
                      (
                        category
                      ) =>
                        category.active !==
                        false
                    )
                    .sort(
                      (
                        a,
                        b
                      ) =>
                        Number(
                          a.order ?? 9999
                        ) -
                        Number(
                          b.order ?? 9999
                        )
                    )
                    .map(
                      (
                        category
                      ) =>
                        normalizeCategory(
                          category
                        )
                    );

                setCategories(
                  normalized
                );
              }

              setIsFirebaseConnected(
                true
              );

              if (
                !firebaseInitializedRef.current
              ) {
                firebaseInitializedRef.current =
                  true;
              }
            }
          );

        unsubscribeMenuItems =
          subscribeToMenuItems(
            (firebaseItems) => {
              menuItemsReceivedRef.current =
                true;

              if (
                firebaseItems.length >
                0
              ) {
                const normalized =
                  firebaseItems
                    .filter(
                      (
                        item
                      ) =>
                        item.active !==
                        false
                    )
                    .sort(
                      (
                        a,
                        b
                      ) =>
                        Number(
                          a.order ?? 9999
                        ) -
                        Number(
                          b.order ?? 9999
                        )
                    )
                    .map(
                      (
                        item
                      ) =>
                        normalizeMenuItem(
                          item
                        )
                    );

                setMenuItems(
                  normalized
                );
              }

              setIsFirebaseConnected(
                true
              );
            }
          );

        unsubscribeRestaurant =
          subscribeToRestaurantInfo(
            (
              firebaseRestaurant:
                | Record<
                    string,
                    unknown
                  >
                | null
            ) => {
              restaurantReceivedRef.current =
                true;

              if (
                firebaseRestaurant
              ) {
                setRestaurantInfo(
                  normalizeRestaurantInfo(
                    firebaseRestaurant
                  )
                );
              }

              setIsFirebaseConnected(
                true
              );
            }
          );
      } catch (error) {
        console.error(
          'Error inicializando Firebase:',
          error
        );

        setIsFirebaseConnected(
          false
        );
      }
    };

    initializeFirebase();

    return () => {
      unsubscribeCategories?.();
      unsubscribeMenuItems?.();
      unsubscribeRestaurant?.();
    };
  }, []);

  /* ============================================================
     SEED FIREBASE
  ============================================================ */

  useEffect(() => {
    const seedIfFirebaseEmpty =
      async () => {
        const user =
          auth.currentUser;

        if (!user) {
          return;
        }

        if (
          !categoriesReceivedRef.current ||
          !menuItemsReceivedRef.current
        ) {
          return;
        }

        try {
          setIsFirebaseSyncing(
            true
          );

          const {
            getCategories,
            getMenuItems,
          } = await import(
            '../lib/firebase'
          );

          const currentCategories =
            await getCategories();

          const currentMenuItems =
            await getMenuItems();

          if (
            currentCategories.length ===
            0
          ) {
            await saveCategoriesBatch(
              INITIAL_CATEGORIES.map(
                (
                  category: Category,
                  index: number
                ) => ({
                  ...category,
                  id: category.id,
                  order: index,
                  active: true,
                })
              )
            );
          }

          if (
            currentMenuItems.length ===
            0
          ) {
            await saveMenuItemsBatch(
              INITIAL_MENU_ITEMS.map(
                (
                  item: MenuItem,
                  index: number
                ) => ({
                  ...item,
                  id: item.id,
                  order: index,
                  price:
                    Number(
                      item.price
                    ) || 0,
                  active: true,
                })
              )
            );
          }

          if (
            !restaurantReceivedRef.current
          ) {
            await saveRestaurantInfo(
              getInitialRestaurantInfo()
            );
          }

          setIsFirebaseConnected(
            true
          );
        } catch (error) {
          console.error(
            'Error verificando datos iniciales:',
            error
          );
        } finally {
          setIsFirebaseSyncing(
            false
          );
        }
      };

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            return;
          }

          await seedIfFirebaseEmpty();
        }
      );

    return () => unsubscribe();
  }, []);

  /* ============================================================
     PLATOS
  ============================================================ */

  const addItem = (
    itemData: Omit<MenuItem, 'id'>
  ): MenuItem => {
    const newId =
      `item-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    const newItem: MenuItem = {
      ...itemData,
      id: newId,
    };

    setMenuItems(
      (prev) => [
        newItem,
        ...prev,
      ]
    );

    setIsFirebaseSyncing(
      true
    );

    const {
      id: _id,
      ...itemWithoutId
    } = newItem;

    createMenuItemWithId(
      newId,
      itemWithoutId
    )
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error agregando plato:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });

    return newItem;
  };

  const updateItem = (
    id: string,
    updated: Partial<MenuItem>
  ) => {
    setMenuItems(
      (prev) =>
        prev.map(
          (item: MenuItem) =>
            item.id === id
              ? {
                  ...item,
                  ...updated,
                }
              : item
        )
    );

    setIsFirebaseSyncing(
      true
    );

    updateMenuItemInFirestore(
      id,
      updated
    )
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error actualizando plato:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  const deleteItem = (
    id: string
  ) => {
    setMenuItems(
      (prev) =>
        prev.filter(
          (item: MenuItem) =>
            item.id !== id
        )
    );

    setIsFirebaseSyncing(
      true
    );

    deleteMenuItemFromFirestore(
      id
    )
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error eliminando plato:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  const duplicateItem = (
    id: string
  ): MenuItem | null => {
    const original =
      menuItems.find(
        (item: MenuItem) =>
          item.id === id
      );

    if (!original) {
      return null;
    }

    const duplicated: MenuItem = {
      ...original,
      id:
        `item-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,
      name:
        `${original.name} (Copia)`,
    };

    setMenuItems(
      (prev) => [
        duplicated,
        ...prev,
      ]
    );

    setIsFirebaseSyncing(
      true
    );

    const {
      id: _id,
      ...itemWithoutId
    } = duplicated;

    createMenuItemWithId(
      duplicated.id,
      itemWithoutId
    )
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error duplicando plato:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });

    return duplicated;
  };

  const bulkUpdatePrices = (
    percentage: number,
    categoryId?: string
  ) => {
    const factor =
      1 + percentage / 100;

    const updatedItems =
      menuItems.map(
        (item: MenuItem) => {
          if (
            categoryId &&
            item.categoryId !==
              categoryId
          ) {
            return item;
          }

          const newPrice =
            Math.round(
              (item.price *
                factor) /
                50
            ) * 50;

          const updatedVariants =
            item.variants?.map(
              (variant) => ({
                ...variant,
                price:
                  Math.round(
                    (variant.price *
                      factor) /
                      50
                  ) * 50,
              })
            );

          return {
            ...item,
            price: newPrice,
            variants:
              updatedVariants,
          };
        }
      );

    setMenuItems(
      updatedItems
    );

    setIsFirebaseSyncing(
      true
    );

    const itemsToUpdate =
      updatedItems.filter(
        (item: MenuItem) => {
          if (!categoryId) {
            return true;
          }

          return (
            item.categoryId ===
            categoryId
          );
        }
      );

    Promise.all(
      itemsToUpdate.map(
        (item: MenuItem) =>
          updateMenuItemInFirestore(
            item.id,
            {
              price: item.price,
              variants:
                item.variants,
            }
          )
      )
    )
      .then(() => {
        setIsFirebaseConnected(
          true
        );
      })
      .catch((error) => {
        console.error(
          'Error actualizando precios:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  /* ============================================================
     CATEGORÍAS
  ============================================================ */

  const addCategory = (
    categoryData: Omit<
      Category,
      'id'
    >
  ): Category => {
    const newId =
      `cat-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}`;

    const newCategory: Category = {
      ...categoryData,
      id: newId,
    };

    setCategories(
      (prev) => [
        ...prev,
        newCategory,
      ]
    );

    setIsFirebaseSyncing(
      true
    );

    const {
      id: _id,
      ...categoryWithoutId
    } = newCategory;

    createCategoryWithId(
      newId,
      categoryWithoutId
    )
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error agregando categoría:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });

    return newCategory;
  };

  const updateCategory = (
    id: string,
    updated: Partial<Category>
  ) => {
    setCategories(
      (prev) =>
        prev.map(
          (
            category: Category
          ) =>
            category.id === id
              ? {
                  ...category,
                  ...updated,
                }
              : category
        )
    );

    setIsFirebaseSyncing(
      true
    );

    updateCategoryInFirestore(
      id,
      updated
    )
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error actualizando categoría:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  const deleteCategory = (
    id: string
  ) => {
    const itemsToDelete =
      menuItems.filter(
        (item: MenuItem) =>
          item.categoryId === id
      );

    setCategories(
      (prev) =>
        prev.filter(
          (
            category: Category
          ) =>
            category.id !== id
        )
    );

    setMenuItems(
      (prev) =>
        prev.filter(
          (item: MenuItem) =>
            item.categoryId !== id
        )
    );

    setIsFirebaseSyncing(
      true
    );

    Promise.all([
      deleteCategoryFromFirestore(
        id
      ),

      ...itemsToDelete.map(
        (item: MenuItem) =>
          deleteMenuItemFromFirestore(
            item.id
          )
      ),
    ])
      .then(() => {
        setIsFirebaseConnected(
          true
        );
      })
      .catch((error) => {
        console.error(
          'Error eliminando categoría:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  const reorderCategories = (
    fromIndex: number,
    toIndex: number
  ) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >=
        categories.length ||
      toIndex >=
        categories.length
    ) {
      return;
    }

    const copy = [
      ...categories,
    ];

    const [removed] =
      copy.splice(
        fromIndex,
        1
      );

    if (!removed) {
      return;
    }

    copy.splice(
      toIndex,
      0,
      removed
    );

    setCategories(copy);

    setIsFirebaseSyncing(
      true
    );

    Promise.all(
      copy.map(
        (
          category: Category,
          index: number
        ) =>
          updateCategoryInFirestore(
            category.id,
            {
              order: index,
            }
          )
      )
    )
      .then(() => {
        setIsFirebaseConnected(
          true
        );
      })
      .catch((error) => {
        console.error(
          'Error reordenando categorías:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  /* ============================================================
     SALSAS
  ============================================================ */

  const setPastaSauces = (
    sauces: string[]
  ) => {
    setPastaSaucesState(
      sauces
    );
  };

  const addPastaSauce = (
    sauce: string
  ) => {
    if (!sauce.trim()) {
      return;
    }

    setPastaSauces([
      ...pastaSauces,
      sauce.trim(),
    ]);
  };

  const removePastaSauce = (
    index: number
  ) => {
    setPastaSauces(
      pastaSauces.filter(
        (
          _: string,
          i: number
        ) => i !== index
      )
    );
  };

  /* ============================================================
     GUARNICIONES
  ============================================================ */

  const setGuarniciones = (
    sides: string[]
  ) => {
    setGuarnicionesState(
      sides
    );
  };

  const addGuarnicion = (
    side: string
  ) => {
    if (!side.trim()) {
      return;
    }

    setGuarniciones([
      ...guarniciones,
      side.trim(),
    ]);
  };

  const removeGuarnicion = (
    index: number
  ) => {
    setGuarniciones(
      guarniciones.filter(
        (
          _: string,
          i: number
        ) => i !== index
      )
    );
  };

  /* ============================================================
     RESTAURANTE
  ============================================================ */

  const updateRestaurantInfo = (
    info: Partial<RestaurantInfoType>
  ) => {
    const next: RestaurantInfoType =
      {
        ...restaurantInfo,
        ...info,

        wifi: info.wifi
          ? {
              ...restaurantInfo.wifi,
              ...info.wifi,
            }
          : restaurantInfo.wifi,
      };

    setRestaurantInfo(
      next
    );

    setIsFirebaseSyncing(
      true
    );

    saveRestaurantInfo(
      next as unknown as Record<
        string,
        unknown
      >
    )
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error guardando información del restaurante:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  /* ============================================================
     RESET
  ============================================================ */

  const resetToDefaults = () => {
    setCategories(
      INITIAL_CATEGORIES
    );

    setMenuItems(
      INITIAL_MENU_ITEMS
    );

    setRestaurantInfo(
      getInitialRestaurantInfo()
    );

    setPastaSaucesState(
      INITIAL_PASTA_SAUCES
    );

    setGuarnicionesState(
      INITIAL_GUARNICIONES
    );

    try {
      localStorage.removeItem(
        STORAGE_KEYS.CATEGORIES
      );

      localStorage.removeItem(
        STORAGE_KEYS.MENU_ITEMS
      );

      localStorage.removeItem(
        STORAGE_KEYS.RESTAURANT_INFO
      );

      localStorage.removeItem(
        STORAGE_KEYS.PASTA_SAUCES
      );

      localStorage.removeItem(
        STORAGE_KEYS.GUARNICIONES
      );
    } catch {}

    if (!auth.currentUser) {
      return;
    }

    setIsFirebaseSyncing(
      true
    );

    Promise.all([
      saveCategoriesBatch(
        INITIAL_CATEGORIES.map(
          (
            category: Category,
            index: number
          ) => ({
            ...category,
            id: category.id,
            order: index,
            active: true,
          })
        )
      ),

      saveMenuItemsBatch(
        INITIAL_MENU_ITEMS.map(
          (
            item: MenuItem,
            index: number
          ) => ({
            ...item,
            id: item.id,
            order: index,
            price:
              Number(
                item.price
              ) || 0,
            active: true,
          })
        )
      ),

      saveRestaurantInfo(
        getInitialRestaurantInfo() as unknown as Record<
          string,
          unknown
        >
      ),
    ])
      .then(() => {
        setIsFirebaseConnected(
          true
        );
      })
      .catch((error) => {
        console.error(
          'Error restaurando datos:',
          error
        );

        setIsFirebaseConnected(
          false
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  /* ============================================================
     EXPORTAR
  ============================================================ */

  const exportDataJSON =
    (): string => {
      return JSON.stringify(
        {
          version: '2.0',
          exportedAt:
            new Date().toISOString(),
          restaurantInfo,
          categories,
          menuItems,
          pastaSauces,
          guarniciones,
        },
        null,
        2
      );
    };

  /* ============================================================
     IMPORTAR
  ============================================================ */

  const importDataJSON = (
    jsonString: string
  ): boolean => {
    try {
      const data: {
        categories?: unknown[];
        menuItems?: unknown[];
        restaurantInfo?: unknown;
        pastaSauces?: unknown;
        guarniciones?: unknown;
      } = JSON.parse(
        jsonString
      );

      if (
        !Array.isArray(
          data.categories
        ) ||
        !Array.isArray(
          data.menuItems
        )
      ) {
        throw new Error(
          'Formato JSON de menú inválido'
        );
      }

      const normalizedCategories =
        data.categories.map(
          (
            category: unknown
          ) =>
            normalizeCategory(
              category as Partial<Category>
            )
        );

      const normalizedMenuItems =
        data.menuItems.map(
          (
            item: unknown
          ) =>
            normalizeMenuItem(
              item as Partial<MenuItem>
            )
        );

      setCategories(
        normalizedCategories
      );

      setMenuItems(
        normalizedMenuItems
      );

      if (
        data.restaurantInfo &&
        typeof data.restaurantInfo ===
          'object'
      ) {
        setRestaurantInfo(
          normalizeRestaurantInfo(
            data.restaurantInfo as Record<
              string,
              unknown
            >
          )
        );
      }

      if (
        Array.isArray(
          data.pastaSauces
        )
      ) {
        setPastaSaucesState(
          data.pastaSauces.filter(
            (
              value: unknown
            ): value is string =>
              typeof value ===
              'string'
          )
        );
      }

      if (
        Array.isArray(
          data.guarniciones
        )
      ) {
        setGuarnicionesState(
          data.guarniciones.filter(
            (
              value: unknown
            ): value is string =>
              typeof value ===
              'string'
          )
        );
      }

      if (!auth.currentUser) {
        return true;
      }

      setIsFirebaseSyncing(
        true
      );

      Promise.all([
        saveCategoriesBatch(
          normalizedCategories.map(
            (
              category: Category,
              index: number
            ) => ({
              ...category,
              id: category.id,
              order: index,
              active: true,
            })
          )
        ),

        saveMenuItemsBatch(
          normalizedMenuItems.map(
            (
              item: MenuItem,
              index: number
            ) => ({
              ...item,
              id: item.id,
              order: index,
              price:
                Number(
                  item.price
                ) || 0,
              active: true,
            })
          )
        ),

        data.restaurantInfo
          ? saveRestaurantInfo(
              normalizeRestaurantInfo(
                data.restaurantInfo as Record<
                  string,
                  unknown
                >
              ) as unknown as Record<
                string,
                unknown
              >
            )
          : Promise.resolve(
              true
            ),
      ])
        .then(() => {
          setIsFirebaseConnected(
            true
          );
        })
        .catch((error) => {
          console.error(
            'Error importando datos:',
            error
          );

          setIsFirebaseConnected(
            false
          );
        })
        .finally(() => {
          setIsFirebaseSyncing(
            false
          );
        });

      return true;
    } catch (error) {
      console.error(
        'Error importando menú JSON:',
        error
      );

      return false;
    }
  };

  /* ============================================================
     SINCRONIZAR
  ============================================================ */

  const syncToCloudNow =
    async (): Promise<boolean> => {
      if (!auth.currentUser) {
        console.error(
          'No se puede sincronizar: no hay un administrador autenticado.'
        );

        setIsFirebaseConnected(
          false
        );

        return false;
      }

      try {
        setIsFirebaseSyncing(
          true
        );

        await saveCategoriesBatch(
          categories.map(
            (
              category: Category,
              index: number
            ) => ({
              ...category,
              id: category.id,
              order: index,
              active: true,
            })
          )
        );

        await saveMenuItemsBatch(
          menuItems.map(
            (
              item: MenuItem,
              index: number
            ) => ({
              ...item,
              id: item.id,
              order: index,
              price:
                Number(
                  item.price
                ) || 0,
              active: true,
            })
          )
        );

        await saveRestaurantInfo(
          restaurantInfo as unknown as Record<
            string,
            unknown
          >
        );

        setIsFirebaseConnected(
          true
        );

        return true;
      } catch (error) {
        console.error(
          'Error sincronizando con Firebase:',
          error
        );

        setIsFirebaseConnected(
          false
        );

        return false;
      } finally {
        setIsFirebaseSyncing(
          false
        );
      }
    };

  /* ============================================================
     PROVIDER
  ============================================================ */

  return (
    <MenuContext.Provider
      value={{
        categories,
        menuItems,
        restaurantInfo,
        pastaSauces,
        guarniciones,

        isAdminOpen,
        isAdminLoggedIn,

        isFirebaseSyncing,
        isFirebaseConnected,

        setIsAdminOpen,
        setIsAdminLoggedIn,

        addItem,
        updateItem,
        deleteItem,
        duplicateItem,
        bulkUpdatePrices,

        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,

        setPastaSauces,
        addPastaSauce,
        removePastaSauce,

        setGuarniciones,
        addGuarnicion,
        removeGuarnicion,

        updateRestaurantInfo,

        resetToDefaults,

        exportDataJSON,
        importDataJSON,

        syncToCloudNow,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

/* ============================================================
   HOOK
============================================================ */

export const useMenu = () => {
  const context =
    useContext(MenuContext);

  if (!context) {
    throw new Error(
      'useMenu must be used within a MenuProvider'
    );
  }

  return context;
};
