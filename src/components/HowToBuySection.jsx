// src/components/HowToBuySection.jsx
import { ShoppingBag, CreditCard, SendHorizontal, CheckCircle2 } from 'lucide-react';

export const HowToBuySection = () => {
    return (
        <section className="my-14 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="bg-sky-50 text-cg-blue border border-sky-100 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                    Fácil, Rápido y Seguro
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                    ¿Cómo comprar en Colombian Games Shop?
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                    Elige tus cartas favoritas y selecciona el método de pago que prefieras con total confianza y garantía.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Paso 1 */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:border-cg-blue/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-cg-blue mb-4">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-cg-blue uppercase tracking-wider mb-1">Paso 1</span>
                    <h3 className="font-bold text-slate-800 text-base mb-2">Arma tu Carrito</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                        Explora nuestro catálogo de Pokémon, Yu-Gi-Oh!, One Piece y Magic, selecciona tus cartas y agrégalas al carrito de compras.
                    </p>
                </div>

                {/* Paso 2 */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:border-cg-blue/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-cg-blue mb-4">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-cg-blue uppercase tracking-wider mb-1">Paso 2</span>
                    <h3 className="font-bold text-slate-800 text-base mb-2">Elige tu Método de Pago</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                        <strong className="text-slate-700">Pago Web:</strong> Paga en línea con PSE, Nequi o tarjetas vía Mercado Pago.<br />
                        <strong className="text-slate-700">Contra Entrega:</strong> Paga al recibir tu pedido en casa.
                    </p>
                </div>

                {/* Paso 3 */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:border-cg-blue/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-cg-blue mb-4">
                        <SendHorizontal className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-cg-blue uppercase tracking-wider mb-1">Paso 3</span>
                    <h3 className="font-bold text-slate-800 text-base mb-2">¡Despacho Inmediato!</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                        Finaliza tu pedido o confirma tu pago por WhatsApp y prepararemos tu envío de inmediato con empaque seguro y garantía.
                    </p>
                </div>
            </div>
        </section>
    );
};
