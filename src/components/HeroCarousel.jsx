// src/components/HeroCarousel.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 👇 AQUÍ EDITAS O REEMPLAZAS TUS BANNERS FÁCILMENTE
const BANNERS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=1400&q=80",
        badge: "Trading Card Game",
        title: "Yu-Gi-Oh! & TCGs",
        subtitle: "Encuentra singles, cajas selladas, sobres y accesorios originales con envío seguro a todo Colombia.",
        bgColor: "from-[#2c4785]/95 via-[#2c4785]/50 to-transparent"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1400&q=80",
        badge: "Nuevas Expansiones",
        title: "Pokémon TCG & One Piece",
        subtitle: "Booster Boxes, Elite Trainer Boxes y cartas sueltas verificadas en estado Near Mint.",
        bgColor: "from-slate-900/90 via-slate-900/50 to-transparent"
    }
];

export const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cambio automático cada 6 segundos
    useEffect(() => {
        if (BANNERS.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    };

    const currentBanner = BANNERS[currentIndex];

    return (
        <section id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
            <div className="relative rounded-md overflow-hidden shadow-md bg-[#3b5998] h-56 sm:h-72 md:h-80 flex items-center group">

                {/* Imagen de Fondo */}
                <img
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                />

                {/* Degradado lateral para legibilidad */}
                <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.bgColor}`} />

                {/* Textos del Banner */}
                <div className="relative z-10 px-8 sm:px-14 max-w-xl text-white">
                    {currentBanner.badge && (
                        <span className="inline-block bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded uppercase mb-2 tracking-wider">
                            {currentBanner.badge}
                        </span>
                    )}
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md mb-2">
                        {currentBanner.title}
                    </h1>
                    <p className="text-sm sm:text-base text-sky-100 font-medium drop-shadow">
                        {currentBanner.subtitle}
                    </p>
                </div>

                {/* Flechas de navegación (aparecen al pasar el mouse si hay más de 1 banner) */}
                {BANNERS.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            aria-label="Anterior"
                            className="absolute left-3 z-20 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            aria-label="Siguiente"
                            className="absolute right-3 z-20 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Puntos indicadores */}
            <div className="flex justify-center gap-2 mt-4">
                {BANNERS.map((banner, idx) => (
                    <button
                        key={banner.id}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Ir al banner ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${currentIndex === idx ? 'w-6 bg-cg-blue' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};