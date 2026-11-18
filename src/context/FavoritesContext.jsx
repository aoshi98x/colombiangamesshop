// src/context/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('cg_tcg_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error al cargar favoritos desde localStorage:", e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('cg_tcg_favorites', JSON.stringify(favorites));
        } catch (e) {
            console.error("Error al guardar favoritos en localStorage:", e);
        }
    }, [favorites]);

    const isFavorite = (productId) => {
        return favorites.some(item => item.id === productId);
    };

    const toggleFavorite = (product) => {
        if (!product || !product.id) return;

        setFavorites(prev => {
            const exists = prev.some(item => item.id === product.id);
            if (exists) {
                // Eliminar de favoritos
                return prev.filter(item => item.id !== product.id);
            } else {
                // Almacenar todos los datos del producto completo para persistencia local 100%
                const productSnapshot = {
                    id: product.id,
                    name: product.name || 'Producto sin nombre',
                    tcg: product.tcg || 'General',
                    expansion: product.expansion || '',
                    rarity: product.rarity || '',
                    condition: product.condition || 'NM',
                    price: Number(product.price) || 0,
                    stock: Number(product.stock) || 0,
                    images: product.images || (product.image ? [product.image] : []),
                    image: product.image || (product.images?.[0] || ''),
                    description: product.description || '',
                    savedAt: new Date().toISOString()
                };
                return [productSnapshot, ...prev];
            }
        });
    };

    const removeFavorite = (productId) => {
        setFavorites(prev => prev.filter(item => item.id !== productId));
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            totalFavorites: favorites.length,
            isFavorite,
            toggleFavorite,
            removeFavorite,
            clearFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
    }
    return context;
};

