// src/pages/CategoryPage.jsx
import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { 
    Loader2, 
    Sparkles, 
    ArrowLeft, 
    Search, 
    Filter,
    PackageOpen
} from 'lucide-react';

// Banners e información por defecto para cada categoría / franquicia
// (Puedes cambiar las URLs de las imágenes y títulos cuando desees)
const CATEGORY_METADATA = {
    'pokemon': {
        title: 'Pokémon TCG',
        badge: 'Cartas Coleccionables',
        description: 'Explora cartas individuales, expansiones recientes, cajas selladas y cartas ultra raras de Pokémon.',
        bannerImage: 'https://images.unsplash.com/photo-1613770920295-90f81544dd53?auto=format&fit=crop&w=1600&q=80',
        bgColor: 'from-amber-500/90 via-amber-600/60 to-slate-900/80',
    },
    'yu-gi-oh!': {
        title: 'Yu-Gi-Oh! TCG',
        badge: 'Trading Card Game',
        description: 'Monstruos, magias y trampas. Singles, sobres y accesorios para tus mejores duelos competitivos.',
        bannerImage: 'https://tcg-corner.com/cdn/shop/files/Banner_20Categorias_20TCG_20-_20YiGiOh_42119e7e-bfa6-444c-8d97-7693c584d769_1920x.png',
        bgColor: 'from-[#1e3a8a]/90 via-[#1e3a8a]/50 to-slate-900/80',
    },
    'yugioh': {
        title: 'Yu-Gi-Oh! TCG',
        badge: 'Trading Card Game',
        description: 'Monstruos, magias y trampas. Singles, sobres y accesorios para tus mejores duelos competitivos.',
        bannerImage: 'https://tcg-corner.com/cdn/shop/files/Banner_20Categorias_20TCG_20-_20YiGiOh_42119e7e-bfa6-444c-8d97-7693c584d769_1920x.png',
        bgColor: 'from-[#1e3a8a]/90 via-[#1e3a8a]/50 to-slate-900/80',
    },
    'one piece': {
        title: 'One Piece Card Game',
        badge: 'Bandai TCG',
        description: 'Líderes, personajes y cartas alternativas de la tripulación de Sombrero de Paja y más.',
        bannerImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
        bgColor: 'from-rose-600/90 via-red-700/60 to-slate-900/80',
    },
    'magic': {
        title: 'Magic: The Gathering',
        badge: 'Wizards of the Coast',
        description: 'Cartas para Commander, Modern, Standard, tierras especiales y sobres de colección.',
        bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        bgColor: 'from-purple-800/90 via-indigo-900/60 to-slate-900/80',
    },
    'magic: the gathering': {
        title: 'Magic: The Gathering',
        badge: 'Wizards of the Coast',
        description: 'Cartas para Commander, Modern, Standard, tierras especiales y sobres de colección.',
        bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        bgColor: 'from-purple-800/90 via-indigo-900/60 to-slate-900/80',
    },
    'promos-accesorios': {
        title: 'Promos y Accesorios',
        badge: 'Protección & Colección',
        description: 'Cartas promocionales exclusivas, protectores (sleeves), deck boxes, carpetas y accesorios de protección.',
        bannerImage: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1600&q=80',
        bgColor: 'from-emerald-700/90 via-teal-800/60 to-slate-900/80',
    },
    'default': {
        title: 'Colección TCG',
        badge: 'Catálogo de Juegos de Cartas',
        description: 'Descubre los mejores productos, singles y accesorios seleccionados para ti.',
        bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        bgColor: 'from-sky-700/90 via-blue-800/60 to-slate-900/80',
    }
};

export const CategoryPage = () => {
    const { categorySlug } = useParams();
    const { products, loading, error } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExpansion, setSelectedExpansion] = useState('Todas');
    const [priceSort, setPriceSort] = useState('default'); // 'default', 'low', 'high'

    // Decodificar el parámetro de la URL
    const decodedSlug = decodeURIComponent(categorySlug || '').trim();
    const slugLower = decodedSlug.toLowerCase();

    // Determinar si es la sección combinada de "Promos y Accesorios"
    const isPromosOrAccessories = slugLower === 'promos-accesorios' || 
                                  slugLower === 'promos y accesorios' || 
                                  slugLower === 'accesorios';

    // Metadata visual del encabezado
    const meta = CATEGORY_METADATA[slugLower] || {
        ...CATEGORY_METADATA['default'],
        title: decodedSlug
    };

    // Filtrar productos que coincidan con la franquicia / categoría
    const categoryProducts = useMemo(() => {
        if (!products || products.length === 0) return [];

        return products.filter((product) => {
            const tcgStr = (product.tcg || '').toLowerCase().trim();

            if (isPromosOrAccessories) {
                // Incluye productos cuyo tcg sea "promo", "promos", "accesorio", "accesorios"
                return (
                    tcgStr.includes('promo') ||
                    tcgStr.includes('accesorio') ||
                    tcgStr.includes('accesorios')
                );
            }

            // Comparación flexible (ej: "Yu-Gi-Oh!" coincide con "yu-gi-oh!" o "yugioh")
            const normalizedParam = slugLower.replace(/[^a-z0-9]/g, '');
            const normalizedTcg = tcgStr.replace(/[^a-z0-9]/g, '');

            return (
                tcgStr === slugLower ||
                normalizedTcg === normalizedParam ||
                tcgStr.includes(slugLower)
            );
        });
    }, [products, slugLower, isPromosOrAccessories]);

    // Obtener lista de expansiones presentes en esta categoría para filtros secundarios
    const availableExpansions = useMemo(() => {
        const set = new Set();
        categoryProducts.forEach(p => {
            if (p.expansion && p.expansion.trim() !== '') set.add(p.expansion.trim());
        });
        return ['Todas', ...Array.from(set)];
    }, [categoryProducts]);

    // Filtrado por buscador y ordenamiento dentro de la categoría
    const filteredProducts = useMemo(() => {
        let result = categoryProducts.filter((product) => {
            const matchesSearch = 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.expansion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.rarity && product.rarity.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesExpansion = 
                selectedExpansion === 'Todas' || 
                product.expansion === selectedExpansion;

            return matchesSearch && matchesExpansion;
        });

        if (priceSort === 'low') {
            result.sort((a, b) => a.price - b.price);
        } else if (priceSort === 'high') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [categoryProducts, searchQuery, selectedExpansion, priceSort]);

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans pb-16">
            {/* Banner Dinámico de Encabezado */}
            <div className="relative w-full bg-slate-900 overflow-hidden text-white min-h-[220px] sm:min-h-[280px] flex items-center">
                {/* Imagen de fondo */}
                <img
                    src={meta.bannerImage}
                    alt={meta.title}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = CATEGORY_METADATA.default.bannerImage;
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-40 filter blur-[0.5px] scale-105"
                />

                {/* Capa de degradado con color temático */}
                <div className={`absolute inset-0 bg-gradient-to-r ${meta.bgColor}`} />

                {/* Contenido del Encabezado */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-full mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Volver al Catálogo General</span>
                    </Link>

                    <div className="max-w-2xl">
                        <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                            {meta.badge}
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                            {meta.title}
                        </h1>
                        <p className="text-white/90 text-xs sm:text-sm mt-2 leading-relaxed">
                            {meta.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controles de Búsqueda y Filtros en la Página */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Buscador dentro de la categoría */}
                    <div className="relative w-full sm:max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={`Buscar en ${meta.title}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cg-blue"
                        />
                    </div>

                    {/* Filtro por Expansión y Orden de Precio */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        {availableExpansions.length > 2 && (
                            <select
                                value={selectedExpansion}
                                onChange={(e) => setSelectedExpansion(e.target.value)}
                                className="bg-white border border-slate-300 rounded-lg text-xs px-3 py-2 text-slate-700 focus:outline-none focus:border-cg-blue cursor-pointer"
                            >
                                {availableExpansions.map((exp) => (
                                    <option key={exp} value={exp}>
                                        {exp === 'Todas' ? 'Todas las Expansiones' : exp}
                                    </option>
                                ))}
                            </select>
                        )}

                        <select
                            value={priceSort}
                            onChange={(e) => setPriceSort(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg text-xs px-3 py-2 text-slate-700 focus:outline-none focus:border-cg-blue cursor-pointer"
                        >
                            <option value="default">Ordenar por: Predeterminado</option>
                            <option value="low">Precio: Menor a Mayor</option>
                            <option value="high">Precio: Mayor a Menor</option>
                        </select>

                        <span className="text-xs font-semibold text-slate-500 ml-auto sm:ml-2">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Listado de Productos */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin text-cg-blue mb-3" />
                        <p className="text-sm font-semibold">Cargando productos de {meta.title}...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-rose-600 bg-rose-50 rounded-xl border border-rose-200 text-sm">
                        {error}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto p-8">
                        <div className="w-12 h-12 bg-sky-50 text-cg-blue rounded-full flex items-center justify-center mx-auto mb-3">
                            <PackageOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">No hay productos disponibles</h3>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                            Aún no se encontraron productos registrados bajo esta franquicia o con los filtros seleccionados.
                        </p>
                        <Link
                            to="/"
                            className="inline-block mt-5 text-xs font-bold text-cg-blue hover:underline"
                        >
                            Explorar el catálogo principal
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

