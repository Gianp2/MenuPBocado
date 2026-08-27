import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

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

import { onAuthStateChanged } from 'firebase/auth';

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
  bulkUpdatePrices: (
    percentage: number,
    categoryId?: string
  ) => void;

  addCategory: (
    category: Omit<Category, 'id'>
  ) => Category;

  updateCategory: (
    id: string,
    updated: Partial<Category>
  ) => void;

  deleteCategory: (id: string) => void;

  reorderCategories: (
    fromIndex: number,
    toIndex: number
  ) => void;

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

  importDataJSON: (
    jsonString: string
  ) => boolean;

  syncToCloudNow: () => Promise<boolean>;
}

const STORAGE_KEYS = {
  CATEGORIES: 'pb_menu_categories_v1',
  MENU_ITEMS: 'pb_menu_items_v1',
  RESTAURANT_INFO: 'pb_restaurant_info_v1',
  PASTA_SAUCES: 'pb_pasta_sauces_v1',
  GUARNICIONES: 'pb_guarniciones_v1',
  ADMIN_AUTH: 'pb_admin_auth_v1',
};

const MenuContext =
  createContext<MenuContextType | undefined>(
    undefined
  );

const normalizeCategory = (
  category: any
): Category => ({
  id: String(category?.id ?? ''),
  name: String(category?.name ?? ''),
  icon: String(category?.icon ?? ''),
  shortName: String(
    category?.shortName ??
      category?.name ??
      ''
  ),
  subtitle: String(
    category?.subtitle ?? ''
  ),
  image: category?.image,
  accentColor:
    category?.accentColor,
});

const normalizeMenuItem = (
  item: any
): MenuItem => ({
  id: String(item?.id ?? ''),
  name: String(item?.name ?? ''),
  categoryId: String(
    item?.categoryId ?? ''
  ),
  description: String(
    item?.description ?? ''
  ),
  price: Number(item?.price ?? 0),
  image: item?.image,
  tags: Array.isArray(item?.tags)
    ? item.tags
    : undefined,
  servesCount:
    item?.servesCount,
  ingredients: Array.isArray(
    item?.ingredients
  )
    ? item.ingredients
    : undefined,
  options: Array.isArray(
    item?.options
  )
    ? item.options
    : undefined,
  variants: Array.isArray(
    item?.variants
  )
    ? item.variants
    : undefined,
});

const normalizeRestaurantInfo = (
  data: any
): RestaurantInfoType => ({
  name: String(data?.name ?? ''),
  tagline: String(
    data?.tagline ?? ''
  ),
  description: String(
    data?.description ?? ''
  ),
  address: String(
    data?.address ?? ''
  ),
  phone: String(
    data?.phone ?? ''
  ),
  whatsappNumber: String(
    data?.whatsappNumber ?? ''
  ),
  instagram: String(
    data?.instagram ?? ''
  ),
  hours: String(
    data?.hours ?? ''
  ),
  wifi: {
    network: String(
      data?.wifi?.network ?? ''
    ),
    password: String(
      data?.wifi?.password ?? ''
    ),
  },
});

export const MenuProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [categories, setCategories] =
    useState<Category[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEYS.CATEGORIES
          );

        if (saved) {
          return JSON.parse(saved);
        }

        return INITIAL_CATEGORIES;
      } catch {
        return INITIAL_CATEGORIES;
      }
    });

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEYS.MENU_ITEMS
          );

        if (saved) {
          return JSON.parse(saved);
        }

        return INITIAL_MENU_ITEMS;
      } catch {
        return INITIAL_MENU_ITEMS;
      }
    });

  const [
    restaurantInfo,
    setRestaurantInfo,
  ] =
    useState<RestaurantInfoType>(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEYS.RESTAURANT_INFO
          );

        if (saved) {
          return normalizeRestaurantInfo(
            JSON.parse(saved)
          );
        }

        return normalizeRestaurantInfo(
          INITIAL_RESTAURANT_INFO
        );
      } catch {
        return normalizeRestaurantInfo(
          INITIAL_RESTAURANT_INFO
        );
      }
    });

  const [
    pastaSauces,
    setPastaSaucesState,
  ] = useState<string[]>(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEYS.PASTA_SAUCES
        );

      if (saved) {
        return JSON.parse(saved);
      }

      return INITIAL_PASTA_SAUCES;
    } catch {
      return INITIAL_PASTA_SAUCES;
    }
  });

  const [
    guarniciones,
    setGuarnicionesState,
  ] = useState<string[]>(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEYS.GUARNICIONES
        );

      if (saved) {
        return JSON.parse(saved);
      }

      return INITIAL_GUARNICIONES;
    } catch {
      return INITIAL_GUARNICIONES;
    }
  });

  const [
    isAdminOpen,
    setIsAdminOpen,
  ] = useState(false);

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
            setIsAdminLoggedInState(
              true
            );

            sessionStorage.setItem(
              STORAGE_KEYS.ADMIN_AUTH,
              'true'
            );
          } else {
            setIsAdminLoggedInState(
              false
            );

            sessionStorage.removeItem(
              STORAGE_KEYS.ADMIN_AUTH
            );
          }
        }
      );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CATEGORIES,
        JSON.stringify(categories)
      );
    } catch (error) {
      console.error(
        'Error guardando categorías:',
        error
      );
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.MENU_ITEMS,
        JSON.stringify(menuItems)
      );
    } catch (error) {
      console.error(
        'Error guardando platos:',
        error
      );
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.RESTAURANT_INFO,
        JSON.stringify(
          restaurantInfo
        )
      );
    } catch (error) {
      console.error(
        'Error guardando información:',
        error
      );
    }
  }, [restaurantInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PASTA_SAUCES,
        JSON.stringify(pastaSauces)
      );
    } catch (error) {
      console.error(
        'Error guardando salsas:',
        error
      );
    }
  }, [pastaSauces]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.GUARNICIONES,
        JSON.stringify(guarniciones)
      );
    } catch (error) {
      console.error(
        'Error guardando guarniciones:',
        error
      );
    }
  }, [guarniciones]);

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

    try {
      unsubscribeCategories =
        subscribeToCategories(
          (firebaseCategories) => {
            if (
              firebaseCategories.length >
              0
            ) {
              const normalized =
                firebaseCategories.map(
                  normalizeCategory
                );

              normalized.sort(
                (a: any, b: any) =>
                  Number(a.order ?? 0) -
                  Number(b.order ?? 0)
              );

              setCategories(
                normalized
              );
            }

            setIsFirebaseConnected(
              true
            );
          }
        );

      unsubscribeMenuItems =
        subscribeToMenuItems(
          (firebaseItems) => {
            if (
              firebaseItems.length > 0
            ) {
              const normalized =
                firebaseItems.map(
                  normalizeMenuItem
                );

              normalized.sort(
                (a: any, b: any) =>
                  Number(a.order ?? 0) -
                  Number(b.order ?? 0)
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
            firebaseRestaurant: any
          ) => {
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

    return () => {
      if (unsubscribeCategories) {
        unsubscribeCategories();
      }

      if (unsubscribeMenuItems) {
        unsubscribeMenuItems();
      }

      if (unsubscribeRestaurant) {
        unsubscribeRestaurant();
      }
    };
  }, []);

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

    setMenuItems((prev) => [
      newItem,
      ...prev,
    ]);

    setIsFirebaseSyncing(true);

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
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updated,
            }
          : item
      )
    );

    setIsFirebaseSyncing(true);

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
    setMenuItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );

    setIsFirebaseSyncing(true);

    deleteMenuItemFromFirestore(id)
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
        (item) => item.id === id
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

    setMenuItems((prev) => [
      duplicated,
      ...prev,
    ]);

    setIsFirebaseSyncing(true);

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
      menuItems.map((item) => {
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
      });

    setMenuItems(
      updatedItems
    );

    setIsFirebaseSyncing(true);

    const itemsToUpdate =
      updatedItems.filter(
        (item) => {
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
        (item) =>
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

    setCategories((prev) => [
      ...prev,
      newCategory,
    ]);

    setIsFirebaseSyncing(true);

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
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? {
              ...category,
              ...updated,
            }
          : category
      )
    );

    setIsFirebaseSyncing(true);

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
    setCategories((prev) =>
      prev.filter(
        (category) =>
          category.id !== id
      )
    );

    const itemsToDelete =
      menuItems.filter(
        (item) =>
          item.categoryId === id
      );

    setMenuItems((prev) =>
      prev.filter(
        (item) =>
          item.categoryId !== id
      )
    );

    setIsFirebaseSyncing(true);

    Promise.all([
      deleteCategoryFromFirestore(
        id
      ),
      ...itemsToDelete.map(
        (item) =>
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

    setIsFirebaseSyncing(true);

    Promise.all(
      copy.map(
        (category, index) =>
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
        (_, i) => i !== index
      )
    );
  };

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
        (_, i) => i !== index
      )
    );
  };

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

    setRestaurantInfo(next);

    setIsFirebaseSyncing(true);

    saveRestaurantInfo({
      ...next,
    })
      .then((success) => {
        if (success) {
          setIsFirebaseConnected(
            true
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error guardando información:',
          error
        );
      })
      .finally(() => {
        setIsFirebaseSyncing(
          false
        );
      });
  };

  const resetToDefaults = () => {
    setCategories(
      INITIAL_CATEGORIES
    );

    setMenuItems(
      INITIAL_MENU_ITEMS
    );

    setRestaurantInfo(
      normalizeRestaurantInfo(
        INITIAL_RESTAURANT_INFO
      )
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
    } catch (error) {
      console.error(
        'Error limpiando localStorage:',
        error
      );
    }

    if (!auth.currentUser) {
      return;
    }

    setIsFirebaseSyncing(true);

    Promise.all([
      saveCategoriesBatch(
        INITIAL_CATEGORIES.map(
          (category) => ({
            ...category,
            id: category.id,
            active: true,
          })
        )
      ),

      saveMenuItemsBatch(
        INITIAL_MENU_ITEMS.map(
          (item) => ({
            ...item,
            id: item.id,
            price:
              Number(item.price) ||
              0,
            active: true,
          })
        )
      ),

      saveRestaurantInfo({
        ...INITIAL_RESTAURANT_INFO,
      }),
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

  const exportDataJSON = (): string => {
    const data = {
      version: '2.0',
      exportedAt:
        new Date().toISOString(),
      restaurantInfo,
      categories,
      menuItems,
      pastaSauces,
      guarniciones,
    };

    return JSON.stringify(
      data,
      null,
      2
    );
  };

  const importDataJSON = (
    jsonString: string
  ): boolean => {
    try {
      const data =
        JSON.parse(
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

      setCategories(
        data.categories.map(
          normalizeCategory
        )
      );

      setMenuItems(
        data.menuItems.map(
          normalizeMenuItem
        )
      );

      if (
        data.restaurantInfo
      ) {
        setRestaurantInfo(
          normalizeRestaurantInfo(
            data.restaurantInfo
          )
        );
      }

      if (
        Array.isArray(
          data.pastaSauces
        )
      ) {
        setPastaSaucesState(
          data.pastaSauces
        );
      }

      if (
        Array.isArray(
          data.guarniciones
        )
      ) {
        setGuarnicionesState(
          data.guarniciones
        );
      }

      if (!auth.currentUser) {
        console.warn(
          'Importación local realizada. No se sincronizó con Firebase porque no hay un administrador autenticado.'
        );

        return true;
      }

      setIsFirebaseSyncing(
        true
      );

      Promise.all([
        saveCategoriesBatch(
          data.categories.map(
            (category: any) => ({
              ...category,
              id: String(
                category.id
              ),
            })
          )
        ),

        saveMenuItemsBatch(
          data.menuItems.map(
            (item: any) => ({
              ...item,
              id: String(
                item.id
              ),
              price:
                Number(
                  item.price
                ) || 0,
            })
          )
        ),

        data.restaurantInfo
          ? saveRestaurantInfo({
              ...data.restaurantInfo,
            })
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
            (category) => ({
              ...category,
              id: category.id,
              active: true,
            })
          )
        );

        await saveMenuItemsBatch(
          menuItems.map(
            (item) => ({
              ...item,
              id: item.id,
              price:
                Number(item.price) ||
                0,
              active: true,
            })
          )
        );

        await saveRestaurantInfo({
          ...restaurantInfo,
        });

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