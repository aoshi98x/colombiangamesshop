// src/components/Navbar.jsx
import { ShoppingCart, Search, Heart, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ searchQuery, setSearchQuery, selectedTcg, setSelectedTcg, tcgCategories }) => {
    const { totalItems, setIsCartOpen } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tcgDropdownOpen, setTcgDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const handleSelectCategory = (category) => {
        setSelectedTcg(category);
        setTcgDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm">
            {/* Barra Superior Blanca */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                {/* Logo */}
                <a
                    href="#inicio"
                    onClick={() => handleSelectCategory('Todos')}
                    className="flex items-center gap-2.5 shrink-0"
                >
                    {/* Si tienes la URL de tu logo oficial, puedes reemplazar este bloque por una etiqueta <img src="TU_LOGO.png" /> */}
                    <div className="bg-amber-400 border-2 border-blue-700 text-blue-900 font-black px-2.5 py-1 rounded-md text-lg italic shadow-sm">
                        CG
                    </div>
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
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => handleSelectCategory('Todos')}
                        className="hidden sm:flex items-center gap-1.5 text-cg-blue hover:text-cg-blue-dark font-semibold text-sm transition-colors"
                    >
                        <Heart className="w-4 h-4" />
                        <span>Favoritos</span>
                    </button>

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
                                <div className="absolute left-0 top-full w-48 bg-white text-slate-800 shadow-lg rounded-b-md border border-slate-100 py-1 z-50">
                                    {tcgCategories.map((tcg) => (
                                        <button
                                            key={tcg}
                                            onClick={() => handleSelectCategory(tcg)}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-sky-50 hover:text-cg-blue transition-colors ${selectedTcg === tcg ? 'font-bold text-cg-blue bg-sky-50/50' : ''
                                                }`}
                                        >
                                            {tcg === 'Todos' ? 'Ver Todos los TCG' : tcg}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={() => handleSelectCategory('Accesorios')}
                                className="flex items-center gap-1 hover:text-sky-100 transition-colors py-3 cursor-pointer"
                            >
                                <span>Promos y Accesorios</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </li>

                        <li>
                            <a href="#torneos" className="hover:text-sky-100 transition-colors py-3">
                                Torneos
                            </a>
                        </li>

                        <li>
                            <a href="#contacto" className="hover:text-sky-100 transition-colors py-3">
                                Contacto
                            </a>
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
                        <span className="text-xs uppercase text-sky-200 font-bold block mb-1">Categorías TCG</span>
                        <div className="pl-3 space-y-1.5">
                            {tcgCategories.map(tcg => (
                                <button
                                    key={tcg}
                                    onClick={() => handleSelectCategory(tcg)}
                                    className="block w-full text-left text-sm py-1"
                                >
                                    {tcg}
                                </button>
                            ))}
                        </div>
                    </div>
                    <a href="#contacto" className="block py-1.5 font-semibold">Contacto</a>
                </div>
            )}
        </header>
    );
};