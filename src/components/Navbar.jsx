// src/components/Navbar.jsx
import { ShoppingCart, Search, Heart, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export const Navbar = ({ searchQuery, setSearchQuery, selectedTcg, setSelectedTcg, tcgCategories }) => {
    const { totalItems, setIsCartOpen } = useCart();
    const { totalFavorites } = useFavorites();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tcgDropdownOpen, setTcgDropdownOpen] = useState(false);
    const [promosDropdownOpen, setPromosDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Filtrar categorías que no sean promos o accesorios para el dropdown de TCG
    const franchiseCategories = tcgCategories.filter(tcg => {
        const lower = tcg.toLowerCase();
        return tcg !== 'Todos' && !lower.includes('promo') && !lower.includes('accesorio');
    });

    const handleSelectCategory = (category) => {
        setSelectedTcg(category);
        setTcgDropdownOpen(false);
        setPromosDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate('/');
    };

    const handleNavigateFranchise = (tcg) => {
        setTcgDropdownOpen(false);
        setPromosDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate(`/categoria/${encodeURIComponent(tcg)}`);
    };

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm">
            {/* Barra Superior Blanca */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                {/* Logo */}
                <a
                    href="#inicio"
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

                {/* Buscador Central */}
                <div className="hidden md:flex flex-1 max-w-xl mx-6">
                    <div className="flex w-full">
                        <input
                            type="text"
                            placeholder="Buscador de Productos"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-slate-300 border-r-0 rounded-l-sm px-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cg-blue"
                        />
                        <button
                            type="button"
                            className="bg-cg-blue hover:bg-cg-blue-dark text-white font-semibold px-6 py-2 rounded-r-sm text-sm transition-colors cursor-pointer"
                        >
                            Buscar
                        </button>
                    </div>
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

            {/* Buscador Móvil */}
            <div className="md:hidden px-4 pb-3">
                <div className="flex w-full">
                    <input
                        type="text"
                        placeholder="Buscador de Productos"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-slate-300 border-r-0 rounded-l-sm px-3 py-2 text-sm text-slate-700 focus:outline-none"
                    />
                    <button className="bg-cg-blue text-white font-semibold px-4 py-2 rounded-r-sm text-sm">
                        Buscar
                    </button>
                </div>
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