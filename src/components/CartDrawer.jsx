// src/components/CartDrawer.jsx
import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, ShieldCheck, MessageCircle, CreditCard, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP, FALLBACK_IMAGE } from '../hooks/useProducts';
import { createMercadoPagoPreference } from '../services/mercadoPago';

const WHATSAPP_PHONE = "573000000000"; // 👈 Reemplaza con tu número de WhatsApp de ventas (con código de país 57)

export const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const [paymentType, setPaymentType] = useState('mercadopago'); // 'mercadopago' o 'contraentrega'
    const [isProcessing, setIsProcessing] = useState(false);

    // Estados del formulario para Contraentrega
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        documentId: '',
        email: '',
    });

    if (!isCartOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0 || isProcessing) return;

        if (paymentType === 'mercadopago') {
            setIsProcessing(true);
            try {
                await createMercadoPagoPreference(cart);
            } catch (error) {
                console.error("Error en Checkout:", error);
                alert("Hubo un problema al conectar con Mercado Pago. Inténtalo de nuevo.");
                setIsProcessing(false);
            }
        } else {
            // Flujo Contraentrega -> WhatsApp
            if (!formData.fullName || !formData.address || !formData.documentId || !formData.email) {
                alert("Por favor completa todos los datos de envío y contacto.");
                return;
            }

            const siteUrl = window.location.origin + window.location.pathname;

            let itemsText = cart.map((item, index) => {
                const productLink = `${siteUrl}#/producto/${item.id}`;
                return `${index + 1}. *${item.name}* (${item.tcg} - ${item.condition || 'NM'})\n   Cantidad: ${item.quantity} | Precio: ${formatCOP(item.price * item.quantity)}\n   🔗 Ver producto: ${productLink}`;
            }).join('\n\n');

            const message = encodeURIComponent(
                `🛒 *NUEVO PEDIDO - CONTRAENTREGA*\n\n` +
                `👤 *Cliente:* ${formData.fullName}\n` +
                `🆔 *Cédula/ID:* ${formData.documentId}\n` +
                `📍 *Dirección:* ${formData.address}\n` +
                `📧 *Correo:* ${formData.email}\n\n` +
                `📦 *PRODUCTOS:* \n${itemsText}\n\n` +
                `💰 *TOTAL A PAGAR:* ${formatCOP(totalPrice)}\n\n` +
                `_Aviso de datos: Autorizo el uso de mis datos exclusivamente para almacenamiento como cliente, compartir promociones y procesar la compra._`
            );

            window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
            clearCart();
            setIsCartOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                onClick={() => !isProcessing && setIsCartOpen(false)}
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
                            disabled={isProcessing}
                            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Lista de Productos y Formulario */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-16">
                                <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-600 font-medium">Tu carrito está vacío</p>
                                <p className="text-slate-400 text-xs mt-1">¡Explora nuestras cartas y productos TCG!</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                                            <img
                                                src={item.image || FALLBACK_IMAGE}
                                                alt={item.name}
                                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
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
                                                            disabled={isProcessing}
                                                            className="text-slate-600 hover:text-slate-900 cursor-pointer"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="text-slate-800 text-xs font-bold px-1.5">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={isProcessing || item.quantity >= item.stock}
                                                            className={`${item.quantity >= item.stock ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900 cursor-pointer'}`}
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        disabled={isProcessing}
                                                        className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Selector de Método de Pago */}
                                <div className="pt-2 border-t border-slate-200">
                                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2.5">Método de Pago</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentType('mercadopago')}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${paymentType === 'mercadopago' ? 'border-cg-blue bg-sky-50/50 text-cg-blue' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <CreditCard className="w-5 h-5 mb-1" />
                                            <span className="text-xs font-bold">Pago Web (Mercado Pago)</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentType('contraentrega')}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${paymentType === 'contraentrega' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <Truck className="w-5 h-5 mb-1" />
                                            <span className="text-xs font-bold">Pago Contraentrega</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Formulario condicional para Contraentrega */}
                                {paymentType === 'contraentrega' && (
                                    <form onSubmit={handleCheckout} id="contraentrega-form" className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
                                        <h3 className="text-xs font-bold text-slate-700 uppercase">Datos de Envío y Contacto</h3>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre y Apellido *</label>
                                            <input
                                                type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange}
                                                placeholder="Ej: Carlos Pérez" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Número de Identificación *</label>
                                                <input
                                                    type="text" required name="documentId" value={formData.documentId} onChange={handleInputChange}
                                                    placeholder="Cédula / NIT" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Correo Electrónico *</label>
                                                <input
                                                    type="email" required name="email" value={formData.email} onChange={handleInputChange}
                                                    placeholder="correo@ejemplo.com" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dirección de Entrega y Ciudad *</label>
                                            <input
                                                type="text" required name="address" value={formData.address} onChange={handleInputChange}
                                                placeholder="Calle 123 # 45-67, Bogotá" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                                            />
                                        </div>

                                        <p className="text-[10px] text-slate-500 leading-tight pt-1">
                                            🔒 <strong>Aviso de uso de datos:</strong> Sus datos serán utilizados exclusivamente para almacenamiento como cliente, compartir promociones y procesar la compra.
                                        </p>
                                    </form>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer / Botón Finalizar */}
                    {cart.length > 0 && (
                        <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                            <div className="flex justify-between items-center text-slate-600 text-sm">
                                <span>Subtotal</span>
                                <span className="text-slate-900 font-bold text-base">{formatCOP(totalPrice)}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-slate-900 font-extrabold text-lg">
                                <span>Total</span>
                                <span className="text-cg-blue">{formatCOP(totalPrice)}</span>
                            </div>

                            {paymentType === 'mercadopago' ? (
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full bg-[#009ee3] hover:bg-[#0082be] disabled:bg-sky-300 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm cursor-pointer"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Conectando con Mercado Pago...
                                        </>
                                    ) : (
                                        <>
                                            Pagar en línea con Mercado Pago
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm cursor-pointer"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Finalizar Contraentrega por WhatsApp
                                </button>
                            )}

                            <button
                                onClick={clearCart}
                                disabled={isProcessing}
                                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 pt-1 cursor-pointer"
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