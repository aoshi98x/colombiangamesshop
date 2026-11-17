// src/components/CartDrawer.jsx
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../hooks/useProducts';

export const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

    if (!isCartOpen) return null;

    const handleCheckoutMercadoPago = () => {
        alert("¡Listo para conectar con Mercado Pago en el siguiente paso!");
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">

                    {/* Cabecera */}
                    <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-2.5">
                            <ShoppingBag className="w-5 h-5 text-cg-blue" />
                            <h2 className="text-lg font-bold text-slate-800">Tu Carrito de Compras</h2>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Lista de Productos */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                        {cart.length === 0 ? (
                            <div className="text-center py-20">
                                <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-600 font-medium">Tu carrito está vacío</p>
                                <p className="text-slate-400 text-xs mt-1">¡Explora nuestras cartas y productos sellados!</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex gap-3.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-20 object-contain rounded bg-slate-50 p-1 border border-slate-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[11px] font-bold uppercase text-cg-blue block">
                                            {item.tcg} {item.condition ? `• ${item.condition}` : ''}
                                        </span>
                                        <h4 className="text-slate-800 font-semibold text-sm truncate" title={item.name}>
                                            {item.name}
                                        </h4>
                                        <span className="text-slate-900 font-bold text-sm block mt-0.5">
                                            {formatCOP(item.price)}
                                        </span>

                                        <div className="flex items-center justify-between mt-2.5">
                                            <div className="flex items-center gap-2 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="text-slate-600 hover:text-slate-900"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="text-slate-800 text-xs font-bold px-1.5">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className={`${item.quantity >= item.stock ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'}`}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:text-rose-600 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Checkout */}
                    {cart.length > 0 && (
                        <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                            <div className="flex justify-between items-center text-slate-600 text-sm">
                                <span>Subtotal</span>
                                <span className="text-slate-900 font-bold text-base">{formatCOP(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500 text-xs">
                                <span>Envío (Bogotá / Nacional)</span>
                                <span className="text-emerald-600 font-semibold">Calculado al finalizar</span>
                            </div>
                            <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center text-slate-900 font-extrabold text-lg">
                                <span>Total</span>
                                <span className="text-cg-blue">{formatCOP(totalPrice)}</span>
                            </div>

                            <button
                                onClick={handleCheckoutMercadoPago}
                                className="w-full bg-[#009ee3] hover:bg-[#0082be] text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm cursor-pointer"
                            >
                                Pagar con Mercado Pago
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 pt-1"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};