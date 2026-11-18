// src/pages/ContactPage.jsx
import { 
    MessageCircle, 
    ShieldCheck, 
    Store, 
    Clock, 
    HeartHandshake, 
    Send,
    ExternalLink
} from 'lucide-react';
import logoImg from '../assets/logo.png';

// Íconos SVG limpios y nítidos para marcas de redes sociales
const InstagramIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const FacebookIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
    </svg>
);

export const ContactPage = () => {
    // Número temporal de WhatsApp para fácil edición futura
    const WHATSAPP_NUMBER = "573000000000";
    const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola Colombian Games! Quisiera más información sobre sus productos y eventos.')}`;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
            {/* Encabezado Principal */}
            <div className="bg-gradient-to-b from-white to-slate-100/70 border-b border-slate-200 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-cg-blue border border-sky-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Atención y Comunidad
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Contáctanos
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
                        ¿Tienes dudas sobre un producto, un envío o quieres conocer más de nuestras actividades? Estamos aquí para ayudarte.
                    </p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                {/* Tarjeta de Identidad y Misión */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="shrink-0 text-center">
                            <img 
                                src={logoImg} 
                                alt="Colombian Games" 
                                className="h-28 sm:h-32 w-auto object-contain mx-auto drop-shadow-sm"
                            />
                            <span className="inline-block mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Bogotá, Colombia
                            </span>
                        </div>

                        <div className="border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 flex-grow">
                            <span className="text-cg-blue text-xs font-extrabold uppercase tracking-wider">
                                Sobre Nosotros
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1 mb-3">
                                Pasión por las cartas coleccionables y los juegos de mesa
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                                Somos un <strong>e-commerce especializado</strong> enfocado en expandir el acceso a estas aficiones en todo el país y en brindar un <strong>portal confiable, seguro y ágil para la comercialización de producto 100% oficial</strong> de Pokémon, Yu-Gi-Oh!, One Piece, Magic y nuevos juegos.
                            </p>
                            <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
                                <HeartHandshake className="w-5 h-5 text-cg-blue shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-slate-800 block mb-0.5">Encuentros y Torneos Presenciales:</strong>
                                    Cualquier evento presencial, liga o torneo se realiza <strong>en alianza con nuestras tiendas y hobbies aliados</strong> o en el marco de eventos especiales del medio, los cuales anunciamos y coordinamos activamente a través de nuestras redes sociales oficiales.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Canales de Contacto */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800">
                            Nuestras Redes y Canales Oficiales
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">
                            Síguenos para enterarte de lanzamientos, restocks, torneos presenciales y promociones exclusivas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* WhatsApp */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-7 h-7 fill-current" />
                            </div>
                            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider mb-1">
                                Atención Inmediata
                            </span>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">WhatsApp</h3>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow">
                                Asesoría en compras, estado de tus pedidos, cotizaciones y atención al cliente personalizada.
                            </p>
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Chatear por WhatsApp</span>
                            </a>
                        </div>

                        {/* Instagram */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:border-pink-300 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <InstagramIcon className="w-7 h-7" />
                            </div>
                            <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider mb-1">
                                Comunidad & Novedades
                            </span>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">@cgames.shop</h3>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow">
                                Fotos de stock, aperturas, preventas y anuncios de nuevos torneos y hobbies aliados.
                            </p>
                            <a
                                href="https://instagram.com/cgames.shop"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Seguir en Instagram</span>
                            </a>
                        </div>

                        {/* Facebook */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1877F2] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FacebookIcon className="w-7 h-7" />
                            </div>
                            <span className="text-[11px] font-extrabold text-[#1877F2] uppercase tracking-wider mb-1">
                                Página Oficial
                            </span>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">Colombian Games</h3>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow">
                                Noticias, eventos compartidos, guías y contenido exclusivo de la escena de juegos en Colombia.
                            </p>
                            <a
                                href="https://www.facebook.com/colombiangameshop"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Visitar Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Franja de Garantías */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-cg-blue flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">100% Producto Original</h4>
                            <p className="text-slate-500 text-xs mt-0.5">Distribuidores y material auténtico garantizado.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-cg-blue flex items-center justify-center shrink-0">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Hobbies Aliados</h4>
                            <p className="text-slate-500 text-xs mt-0.5">Alianzas estratégicas para torneos presenciales.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-cg-blue flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Respuesta Rápida</h4>
                            <p className="text-slate-500 text-xs mt-0.5">Atención oportuna a través de WhatsApp y redes.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

