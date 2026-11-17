// src/pages/ProductDetail.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProducts, formatCOP } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Sparkles, ShieldCheck, Truck, MessageCircle, Plus, Minus, Loader2 } from 'lucide-react';

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const { addToCart, cart } = useCart();
    const [quantity, setQuantity] = useState(1);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-cg-blue mb-3" />
                <p className="text-sm">Cargando detalles del producto...</p>
            </div>
        );
    }

    const product = products.find((p) => p.id === Number(id));

    if (!product) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Producto no encontrado</h2>
                <p className="text-slate-500 text-sm mb-6">Es posible que esta carta ya se haya vendido o el enlace no exista.</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-cg-blue text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-cg-blue-dark"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    const itemInCart = cart.find((item) => item.id === product.id);
    const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;
    const maxAvailableToAdd = Math.max(0, product.stock - currentQtyInCart);
    const isOutOfStock = product.stock <= 0 || maxAvailableToAdd <= 0;

    const handleAddMultiple = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setQuantity(1);
    };

    // Enlace de WhatsApp prellenado con el nombre de la carta
    const whatsappMessage = encodeURIComponent(
        `Hola Colombian Games Shop, me interesa este producto: ${product.name} (${product.tcg}) - ${formatCOP(product.price)}`
    );

    // Productos relacionados del mismo TCG
    const relatedProducts = products
        .filter((p) => p.tcg === product.tcg && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Botón Volver */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-cg-blue mb-6 transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver al catálogo
            </button>

            {/* Contenedor Principal del Producto */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">

                {/* Columna Izquierda: Imagen */}
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 flex items-center justify-center min-h-[340px] sm:min-h-[440px]">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-[400px] w-auto object-contain rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Columna Derecha: Información y Compra */}
                <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-cg-blue text-white text-xs font-bold px-3 py-1 rounded uppercase">
                            {product.tcg}
                        </span>
                        {product.condition && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded">
                                Estado: {product.condition}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                        {product.name}
                    </h1>

                    {/* Expansión y Rareza */}
                    {(product.expansion || product.rarity) && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>
                                {product.expansion} {product.rarity ? `• Rareza: ${product.rarity}` : ''}
                            </span>
                        </div>
                    )}

                    {/* Precio */}
                    <div className="py-4 border-y border-slate-100 my-2">
                        <span className="text-xs text-slate-400 uppercase font-semibold block">Precio en Pesos Colombianos</span>
                        <span className="text-3xl sm:text-4xl font-black text-slate-900">
                            {formatCOP(product.price)}
                        </span>
                        <span className={`text-xs font-bold mt-1.5 block ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {product.stock > 0
                                ? `✔ En stock (${product.stock} ${product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'})`
                                : '✘ Agotado temporalmente'}
                        </span>
                    </div>

                    {/* Descripción */}
                    <div className="my-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-1.5">Descripción</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {product.description || 'Producto 100% original garantizado por Colombian Games Shop.'}
                        </p>
                    </div>

                    {/* Selector de Cantidad y Botones */}
                    <div className="mt-auto pt-4 space-y-3">
                        {!isOutOfStock && (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-slate-700">Cantidad:</span>
                                <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 px-2 py-1">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 font-bold text-slate-800 text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => Math.min(maxAvailableToAdd, q + 1))}
                                        disabled={quantity >= maxAvailableToAdd}
                                        className={`p-1 ${quantity >= maxAvailableToAdd ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900 cursor-pointer'}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddMultiple}
                                disabled={isOutOfStock}
                                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${isOutOfStock
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-cg-blue hover:bg-cg-blue-dark text-white shadow-md cursor-pointer active:scale-98'
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.stock <= 0 ? 'Agotado' : isOutOfStock ? 'Máximo en carrito' : 'Agregar al Carrito'}
                            </button>

                            <a
                                href={`https://wa.me/573000000000?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-3.5 px-5 rounded-xl font-bold text-sm border border-emerald-500 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center gap-2 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Consultar
                            </a>
                        </div>
                    </div>

                    {/* Garantías rápidas */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-cg-blue shrink-0" />
                            <span>Originalidad 100% verificada</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-cg-blue shrink-0" />
                            <span>Envío blindado a todo el país</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos Relacionados */}
            {relatedProducts.length > 0 && (
                <section className="mt-14">
                    <h2 className="text-lg font-bold text-slate-800 mb-5">Más de {product.tcg}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((item) => (
                            <Link
                                key={item.id}
                                to={`/producto/${item.id}`}
                                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-cg-blue transition-all flex flex-col"
                            >
                                <div className="h-44 bg-slate-50 rounded-lg p-3 flex items-center justify-center mb-3">
                                    <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                                </div>
                                <span className="text-[11px] font-bold text-cg-blue uppercase">{item.expansion}</span>
                                <h4 className="font-bold text-slate-800 text-sm line-clamp-1 mt-0.5">{item.name}</h4>
                                <span className="font-extrabold text-slate-900 text-base mt-2">{formatCOP(item.price)}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};