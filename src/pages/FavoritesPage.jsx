// src/pages/FavoritesPage.jsx
import { useFavorites } from '../context/FavoritesContext';
import { useProducts, formatCOP, FALLBACK_IMAGE } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { 
    Heart, 
    Trash2, 
    ShoppingCart, 
    MessageCircle, 
    Sparkles, 
    ArrowLeft, 
    PackageX,
    ExternalLink
} from 'lucide-react';

export const FavoritesPage = () => {
    const { favorites, removeFavorite, clearFavorites } = useFavorites();
    const { products, loading } = useProducts();
    const { addToCart, cart } = useCart();

    const WHATSAPP_NUMBER = "573000000000";

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
            {/* Encabezado */}
            <div className="bg-gradient-to-b from-white to-slate-100/70 border-b border-slate-200 py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        Tu Colección Deseada
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Mis Favoritos
                    </h1>
                    <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2 leading-relaxed">
                        Cartas y productos que has guardado. Los datos se conservan en tu dispositivo para que no pierdas su referencia incluso si se agotan o retiran de la web.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {favorites.length === 0 ? (
                    <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs my-8">
                        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No tienes productos en favoritos</h3>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed mb-6">
                            Guarda tus cartas favoritas haciendo clic en el corazón de cualquier producto para consultarlas cuando quieras.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-cg-blue hover:bg-cg-blue-dark text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    <div>
                        {/* Barra de estado y limpiar */}
                        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200">
                            <span className="text-xs font-bold text-slate-700">
                                {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                            </span>
                            <button
                                onClick={clearFavorites}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline cursor-pointer"
                            >
                                Vaciar lista de favoritos
                            </button>
                        </div>

                        {/* Cuadrícula de Favoritos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map((favProduct) => {
                                // Comprobar si sigue existiendo en el sheet activo y si tiene stock
                                const liveProduct = products.find((p) => p.id === favProduct.id);
                                const isAvailableInStore = !loading && !!liveProduct && liveProduct.stock > 0;
                                const isOutOrRemoved = !loading && (!liveProduct || liveProduct.stock <= 0);

                                const itemInCart = cart.find(item => item.id === favProduct.id);
                                const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;
                                const activeStock = liveProduct ? liveProduct.stock : 0;
                                const canAddToCart = isAvailableInStore && currentQtyInCart < activeStock;

                                const mainImage = favProduct.images?.[0] || favProduct.image || FALLBACK_IMAGE;

                                const whatsappInquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                                    `Hola Colombian Games, tengo en mis favoritos este producto pero veo que no está disponible: ${favProduct.name} (${favProduct.tcg || 'TCG'}${favProduct.expansion ? ` - ${favProduct.expansion}` : ''}). ¿Tienen estimada una próxima disponibilidad o restock?`
                                )}`;

                                return (
                                    <div 
                                        key={favProduct.id}
                                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative"
                                    >
                                        {/* Botón para remover de favoritos */}
                                        <button
                                            onClick={() => removeFavorite(favProduct.id)}
                                            title="Eliminar de favoritos"
                                            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Imagen */}
                                        <div className="relative h-56 overflow-hidden bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100">
                                            {liveProduct ? (
                                                <Link to={`/producto/${favProduct.id}`} className="w-full h-full flex items-center justify-center">
                                                    <img
                                                        src={mainImage}
                                                        alt={favProduct.name}
                                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                                                        className={`max-h-full w-auto object-contain rounded group-hover:scale-105 transition-transform duration-300 ${isOutOrRemoved ? 'opacity-50 grayscale' : ''}`}
                                                    />
                                                </Link>
                                            ) : (
                                                <img
                                                    src={mainImage}
                                                    alt={favProduct.name}
                                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                                                    className="max-h-full w-auto object-contain rounded opacity-50 grayscale"
                                                />
                                            )}

                                            <span className="absolute top-3 left-3 bg-cg-blue text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase shadow-xs">
                                                {favProduct.tcg}
                                            </span>

                                            {/* Indicador de no disponible */}
                                            {isOutOrRemoved && (
                                                <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                                                    Agotado / No disponible en web
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                                <span className="truncate">{favProduct.expansion || favProduct.tcg} {favProduct.rarity ? `• ${favProduct.rarity}` : ''}</span>
                                            </div>

                                            {liveProduct ? (
                                                <Link to={`/producto/${favProduct.id}`}>
                                                    <h3 className="text-base font-bold text-slate-800 hover:text-cg-blue transition-colors mb-1.5 line-clamp-1" title={favProduct.name}>
                                                        {favProduct.name}
                                                    </h3>
                                                </Link>
                                            ) : (
                                                <h3 className="text-base font-bold text-slate-700 mb-1.5 line-clamp-1" title={favProduct.name}>
                                                    {favProduct.name}
                                                </h3>
                                            )}

                                            <p className="text-slate-500 text-xs mb-4 line-clamp-2 flex-grow">
                                                {favProduct.description || 'Producto guardado en tus favoritos.'}
                                            </p>

                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                                                        {isAvailableInStore ? `Stock: ${activeStock}` : 'No disponible'}
                                                    </span>
                                                    <span className="text-base font-extrabold text-slate-900">
                                                        {formatCOP(favProduct.price)}
                                                    </span>
                                                </div>

                                                {/* Botón de acción: Agregar al carrito si está disponible, o Consultar por WhatsApp si ya no lo está */}
                                                {isAvailableInStore ? (
                                                    <button
                                                        onClick={() => addToCart(liveProduct || favProduct)}
                                                        disabled={!canAddToCart}
                                                        className={`px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${!canAddToCart
                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            : 'bg-cg-blue hover:bg-cg-blue-dark text-white shadow-xs active:scale-95'
                                                        }`}
                                                    >
                                                        <ShoppingCart className="w-3.5 h-3.5" />
                                                        <span>{currentQtyInCart >= activeStock ? 'Máx.' : 'Comprar'}</span>
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={whatsappInquiryUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Preguntar por WhatsApp si volverá a estar disponible"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-2 rounded-lg text-[11px] flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                                                    >
                                                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                                        <span>Consultar disponibilidad</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

