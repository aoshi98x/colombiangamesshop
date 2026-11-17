// src/components/ProductCard.jsx
import { ShoppingCart, Sparkles } from 'lucide-react';
import { formatCOP, FALLBACK_IMAGE } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
    const { addToCart, cart } = useCart();
    const itemInCart = cart.find(item => item.id === product.id);
    const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;
    const isOutOfStock = product.stock <= 0 || currentQtyInCart >= product.stock;

    // Tomamos la primera imagen del array
    const mainImage = product.images?.[0] || FALLBACK_IMAGE;

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-cg-blue/50 transition-all flex flex-col group">
            <Link
                to={`/producto/${product.id}`}
                className="relative h-60 overflow-hidden bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100 block"
            >
                <img
                    src={mainImage}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                    className={`max-h-full w-auto object-contain rounded group-hover:scale-105 transition-transform duration-300 ${product.stock <= 0 ? 'opacity-40 grayscale' : ''}`}
                />

                <span className="absolute top-3 left-3 bg-cg-blue text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase shadow-sm">
                    {product.tcg}
                </span>

                {product.condition && (
                    <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded">
                        {product.condition}
                    </span>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{product.expansion} {product.rarity ? `• ${product.rarity}` : ''}</span>
                </div>

                <Link to={`/producto/${product.id}`}>
                    <h3 className="text-base font-bold text-slate-800 hover:text-cg-blue transition-colors mb-1.5 line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>
                </Link>

                <p className="text-slate-500 text-xs mb-4 line-clamp-2 flex-grow">{product.description}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    <div>
                        <span className="text-[11px] text-slate-400 block">
                            {product.stock > 0 ? `Disponibles: ${product.stock}` : 'Agotado'}
                        </span>
                        <span className="text-lg font-extrabold text-slate-900">{formatCOP(product.price)}</span>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        className={`px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-cg-blue hover:bg-cg-blue-dark text-white shadow-sm active:scale-95'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock <= 0 ? 'Sin stock' : currentQtyInCart >= product.stock ? 'Máx.' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    );
};