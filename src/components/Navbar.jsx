// src/components/Navbar.jsx
import { ShoppingCart, Search, Heart, ChevronDown, Menu, X, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { formatCOP, FALLBACK_IMAGE } from '../hooks/useProducts';
import logoImg from '../assets/logo.png';

export const Navbar = ({ searchQuery, setSearchQuery, selectedTcg, setSelectedTcg, tcgCategories, allProducts = [] }) => {
    const { totalItems, setIsCartOpen } = useCart();
    const { totalFavorites } = useFavorites();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tcgDropdownOpen, setTcgDropdownOpen] = useState(false);
    const [promosDropdownOpen, setPromosDropdownOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtrar categorías que no sean promos o accesorios para el dropdown de TCG
    const franchiseCategories = useMemo(() => {
        return tcgCategories.filter(tcg => {
            const lower = tcg.toLowerCase();
            return tcg !== 'Todos' && !lower.includes('promo') && !lower.includes('accesorio');
        });
    }, [tcgCategories]);

    // Búsqueda inteligente de sugerencias (máximo 3 productos y coincidencias de TCG)
    const { productSuggestions, matchedTcg } = useMemo(() => {
        const trimmed = searchQuery.trim().toLowerCase();
        if (!trimmed || trimmed.length < 2) {
            return { productSuggestions: [], matchedTcg: null };
        }

        // 1. Revisar si coincide con alguna franquicia/TCG (ej: "pokemon", "yugioh", "magic", "promo")
        const foundTcg = tcgCategories.find(tcg => {
            if (tcg === 'Todos') return false;
            const tcgLower = tcg.toLowerCase();
            const normalizedQuery = trimmed.replace(/[^a-z0-9]/g, '');
            const normalizedTcg = tcgLower.replace(/[^a-z0-9]/g, '');
            return tcgLower.includes(trimmed) || (normalizedQuery.length >= 3 && normalizedTcg.includes(normalizedQuery));
        });

        // 2. Buscar en los productos por cualquier palabra/término (nombre, tcg, expansión, rareza, descripción)
        const terms = trimmed.split(/\s+/).filter(Boolean);

        const scoredProducts = allProducts.map(product => {
            const searchHaystack = `${product.name} ${product.tcg} ${product.expansion} ${product.rarity} ${product.description}`.toLowerCase();

            // Puntuación por coincidencia de términos
            let matchesCount = 0;
            terms.forEach(term => {
                if (searchHaystack.includes(term)) matchesCount++;
            });

            // Relevancia: si coincide con el nombre exacto o empieza con él, suma más puntos
            let score = matchesCount;
            if (product.name.toLowerCase().includes(trimmed)) score += 3;
            if (product.name.toLowerCase().startsWith(trimmed)) score += 2;
            if (product.tcg.toLowerCase().includes(trimmed)) score += 1;

            return { product, score, matchesAll: matchesCount === terms.length };
        });

        // Filtrar productos que coincidan con al menos un término y ordenar por relevancia
        const filtered = scoredProducts
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.product);

        return {
            productSuggestions: filtered,
            matchedTcg: foundTcg || null
        };
    }, [searchQuery, allProducts, tcgCategories]);

    const handleSelectCategory = (category) => {
        setSelectedTcg(category);
        setTcgDropdownOpen(false);
        setPromosDropdownOpen(false);
        setMobileMenuOpen(false);
        setIsSearchFocused(false);
        navigate('/');
    };

    const handleNavigateFranchise = (tcg) => {
        setTcgDropdownOpen(false);
        setPromosDropdownOpen(false);
        setMobileMenuOpen(false);
        setIsSearchFocused(false);
        navigate(`/categoria/${encodeURIComponent(tcg)}`);
    };

    const handleSelectProduct = (productId) => {
        setIsSearchFocused(false);
        navigate(`/producto/${productId}`);
    };

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setIsSearchFocused(false);

        // Si lo que escribió es exactamente el nombre de una franquicia o TCG, navega a CategoryPage
        if (matchedTcg) {
            handleNavigateFranchise(matchedTcg);
            return;
        }

        // Si hay una única sugerencia directa muy clara, o si ya está en home, hace scroll o búsqueda general
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm">
            {/* Barra Superior Blanca */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                {/* Logo */}
                <a
                    onClick={() => handleSelectCategory('Todos')}
                    className="flex items-center gap-2.5 shrink-0 group"
                >
                    <img
                        src={logoImg}
                        alt="Colombian Games"
                        className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="leading-tight">
                        <span className="text-sm sm:text-base font-black text-slate-900 uppercase block tracking-tight">
                            Colombian Games
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 italic block">
                            ¡Hobbies y más!
                        </span>
                    </div>
                </a>

                {/* Buscador Central con Sugerencias Inteligentes */}
                <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-6 relative">
                    <form onSubmit={handleSearchSubmit} className="flex w-full">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Buscar cartas, expansiones, TCGs..."
                                value={searchQuery}
                                onFocus={() => setIsSearchFocused(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchFocused(true);
                                }}
                                className="w-full border border-slate-300 border-r-0 rounded-l-md px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cg-blue focus:ring-1 focus:ring-cg-blue/20"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setIsSearchFocused(false);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-cg-blue hover:bg-cg-blue-dark text-white font-semibold px-6 py-2.5 rounded-r-md text-sm transition-colors cursor-pointer shrink-0"
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Ventana Flotante de Sugerencias (Dropdown con 3 resultados y categoría) */}
                    {isSearchFocused && searchQuery.trim().length >= 2 && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            {/* Sugerencia de Franquicia/TCG si coincide */}
                            {matchedTcg && (
                                <div className="p-2 border-b border-slate-100 bg-sky-50/60">
                                    <button
                                        type="button"
                                        onClick={() => handleNavigateFranchise(matchedTcg)}
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sky-100/70 text-left transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-cg-blue/20 text-cg-blue flex items-center justify-center shrink-0">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-cg-blue block">
                                                    Ir a la página de Franquicia
                                                </span>
                                                <span className="text-sm font-extrabold text-slate-800">
                                                    Ver todo el catálogo de {matchedTcg}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-cg-blue group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}

                            {/* Sugerencia de 3 Productos Más Cercanos */}
                            {productSuggestions.length > 0 ? (
                                <div className="p-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
                                        Productos sugeridos ({productSuggestions.length})
                                    </span>
                                    <div className="space-y-1">
                                        {productSuggestions.map((prod) => {
                                            const prodImage = prod.images?.[0] || prod.image || FALLBACK_IMAGE;
                                            return (
                                                <button
                                                    key={prod.id}
                                                    type="button"
                                                    onClick={() => handleSelectProduct(prod.id)}
                                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                                                >
                                                    <div className="w-12 h-12 rounded-md bg-slate-100 p-1 shrink-0 flex items-center justify-center border border-slate-200/80">
                                                        <img
                                                            src={prodImage}
                                                            alt={prod.name}
                                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>

                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <span className="text-[10px] font-bold uppercase text-cg-blue bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                                                                {prod.tcg}
                                                            </span>
                                                            {prod.expansion && (
                                                                <span className="text-[11px] text-slate-400 truncate">
                                                                    {prod.expansion}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-cg-blue transition-colors truncate">
                                                            {prod.name}
                                                        </h4>
                                                    </div>

                                                    <div className="text-right shrink-0 pl-2">
                                                        <span className="text-sm font-black text-slate-900 block">
                                                            {formatCOP(prod.price)}
                                                        </span>
                                                        <span className={`text-[10px] font-semibold block ${prod.stock > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                            {prod.stock > 0 ? `${prod.stock} disp.` : 'Agotado'}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : !matchedTcg ? (
                                <div className="p-6 text-center text-slate-500 text-xs">
                                    No se encontraron productos coincidentes para <span className="font-bold text-slate-700">"{searchQuery}"</span>.
                                </div>
                            ) : null}

                            {/* Pie del dropdown con atajo para ver todos los resultados */}
                            <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-400 text-[11px]">
                                    Presiona Enter para buscar en todo el catálogo
                                </span>
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="text-cg-blue hover:text-cg-blue-dark font-bold text-[11px] hover:underline cursor-pointer"
                                >
                                    Ver todos los resultados
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Acciones Derecha (Favoritos + Carrito) */}
                <div className="flex items-center gap-4 sm:gap-5">
                    <Link
                        to="/favoritos"
                        className="relative flex items-center gap-1.5 text-slate-700 hover:text-rose-600 font-semibold text-sm transition-colors py-2 px-1"
                        title="Ver mis favoritos"
                    >
                        <Heart className={`w-5 h-5 ${totalFavorites > 0 ? 'text-rose-500 fill-current' : 'text-slate-500'}`} />
                        <span className="hidden sm:inline">Favoritos</span>
                        {totalFavorites > 0 && (
                            <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                                {totalFavorites}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative flex items-center gap-2 text-slate-700 hover:text-cg-blue font-semibold text-sm transition-colors p-2"
                    >
                        <ShoppingCart className="w-6 h-6 text-cg-blue" />
                        <span className="hidden sm:inline">Carrito</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-1 bg-rose-500 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Botón Menú Móvil */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-slate-700 p-1"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Buscador Móvil con Sugerencias */}
            <div className="md:hidden px-4 pb-3 relative">
                <form onSubmit={handleSearchSubmit} className="flex w-full">
                    <input
                        type="text"
                        placeholder="Buscar cartas, expansiones, TCGs..."
                        value={searchQuery}
                        onFocus={() => setIsSearchFocused(true)}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchFocused(true);
                        }}
                        className="w-full border border-slate-300 border-r-0 rounded-l-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-cg-blue"
                    />
                    <button type="submit" className="bg-cg-blue text-white font-semibold px-4 py-2 rounded-r-md text-sm shrink-0">
                        Buscar
                    </button>
                </form>

                {/* Sugerencias Móviles */}
                {isSearchFocused && searchQuery.trim().length >= 2 && (
                    <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                        {matchedTcg && (
                            <div className="p-2 border-b border-slate-100 bg-sky-50">
                                <button
                                    type="button"
                                    onClick={() => handleNavigateFranchise(matchedTcg)}
                                    className="w-full flex items-center justify-between p-2 text-left"
                                >
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-cg-blue block">Franquicia</span>
                                        <span className="text-xs font-bold text-slate-800">Ver todo {matchedTcg}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-cg-blue" />
                                </button>
                            </div>
                        )}
                        {productSuggestions.length > 0 && (
                            <div className="p-2">
                                {productSuggestions.map((prod) => (
                                    <button
                                        key={prod.id}
                                        type="button"
                                        onClick={() => handleSelectProduct(prod.id)}
                                        className="w-full flex items-center gap-2.5 p-2 hover:bg-slate-50 text-left border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-9 h-9 rounded bg-slate-100 p-0.5 shrink-0 flex items-center justify-center">
                                            <img
                                                src={prod.images?.[0] || prod.image || FALLBACK_IMAGE}
                                                alt={prod.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                                            <span className="text-[10px] text-slate-400 block">{prod.tcg}</span>
                                        </div>
                                        <span className="text-xs font-extrabold text-slate-900 shrink-0">
                                            {formatCOP(prod.price)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Barra Azul de Navegación */}
            <nav className="bg-cg-blue text-white hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ul className="flex items-center gap-8 h-12 text-sm font-semibold">
                        <li>
                            <button
                                onClick={() => handleSelectCategory('Todos')}
                                className={`hover:text-sky-100 transition-colors py-3 cursor-pointer ${selectedTcg === 'Todos' ? 'underline underline-offset-4 decoration-2' : ''}`}
                            >
                                Inicio
                            </button>
                        </li>

                        {/* Desplegable TCG */}
                        <li
                            className="relative"
                            onMouseEnter={() => setTcgDropdownOpen(true)}
                            onMouseLeave={() => setTcgDropdownOpen(false)}
                        >
                            <button className="flex items-center gap-1 hover:text-sky-100 transition-colors py-3 cursor-pointer">
                                <span>TCG</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {tcgDropdownOpen && (
                                <div className="absolute left-0 top-full w-52 bg-white text-slate-800 shadow-xl rounded-b-md border border-slate-100 py-1.5 z-50">
                                    <button
                                        onClick={() => handleSelectCategory('Todos')}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-sky-50 hover:text-cg-blue border-b border-slate-100 transition-colors cursor-pointer"
                                    >
                                        Ver Catálogo Completo
                                    </button>
                                    {franchiseCategories.map((tcg) => (
                                        <button
                                            key={tcg}
                                            onClick={() => handleNavigateFranchise(tcg)}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50 hover:text-cg-blue transition-colors cursor-pointer"
                                        >
                                            {tcg}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </li>

                        {/* Desplegable Promos y Accesorios */}
                        <li
                            className="relative"
                            onMouseEnter={() => setPromosDropdownOpen(true)}
                            onMouseLeave={() => setPromosDropdownOpen(false)}
                        >
                            <button
                                onClick={() => handleNavigateFranchise('promos-accesorios')}
                                className="flex items-center gap-1 hover:text-sky-100 transition-colors py-3 cursor-pointer"
                            >
                                <span>Promos y Accesorios</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {promosDropdownOpen && (
                                <div className="absolute left-0 top-full w-56 bg-white text-slate-800 shadow-xl rounded-b-md border border-slate-100 py-1.5 z-50">
                                    <button
                                        onClick={() => handleNavigateFranchise('promos-accesorios')}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-cg-blue bg-sky-50/50 hover:bg-sky-100 transition-colors cursor-pointer"
                                    >
                                        Ver Todo (Promos & Accesorios)
                                    </button>
                                    <button
                                        onClick={() => handleNavigateFranchise('Promo')}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50 hover:text-cg-blue transition-colors cursor-pointer"
                                    >
                                        Cartas Promo
                                    </button>
                                    <button
                                        onClick={() => handleNavigateFranchise('Accesorios')}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50 hover:text-cg-blue transition-colors cursor-pointer"
                                    >
                                        Accesorios y Protección
                                    </button>
                                </div>
                            )}
                        </li>

                        <li>
                            <Link
                                to="/torneos"
                                className={`hover:text-sky-100 transition-colors py-3 ${location.pathname === '/torneos' ? 'underline underline-offset-4 decoration-2 font-bold' : ''}`}
                            >
                                Torneos
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/contacto"
                                className={`hover:text-sky-100 transition-colors py-3 ${location.pathname === '/contacto' ? 'underline underline-offset-4 decoration-2 font-bold' : ''}`}
                            >
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Menú Desplegable Móvil */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-cg-blue text-white px-4 py-3 space-y-2 border-t border-sky-400">
                    <button onClick={() => handleSelectCategory('Todos')} className="block w-full text-left py-1.5 font-semibold">
                        Inicio
                    </button>
                    <div className="py-1">
                        <span className="text-xs uppercase text-sky-200 font-bold block mb-1">Franquicias TCG</span>
                        <div className="pl-3 space-y-1.5">
                            {franchiseCategories.map(tcg => (
                                <button
                                    key={tcg}
                                    onClick={() => handleNavigateFranchise(tcg)}
                                    className="block w-full text-left text-sm py-1"
                                >
                                    {tcg}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="py-1">
                        <span className="text-xs uppercase text-sky-200 font-bold block mb-1">Promos y Accesorios</span>
                        <div className="pl-3 space-y-1.5">
                            <button
                                onClick={() => handleNavigateFranchise('promos-accesorios')}
                                className="block w-full text-left text-sm py-1"
                            >
                                Ver Todo (Promos & Accesorios)
                            </button>
                            <button
                                onClick={() => handleNavigateFranchise('Promo')}
                                className="block w-full text-left text-sm py-1"
                            >
                                Cartas Promo
                            </button>
                            <button
                                onClick={() => handleNavigateFranchise('Accesorios')}
                                className="block w-full text-left text-sm py-1"
                            >
                                Accesorios y Protección
                            </button>
                        </div>
                    </div>
                    <Link
                        to="/favoritos"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-1.5 font-semibold hover:text-sky-100"
                    >
                        <span>Mis Favoritos</span>
                        {totalFavorites > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {totalFavorites}
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/torneos"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 font-semibold hover:text-sky-100"
                    >
                        Torneos
                    </Link>
                    <Link
                        to="/contacto"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 font-semibold hover:text-sky-100"
                    >
                        Contacto
                    </Link>
                </div>
            )}
        </header>
    );
};