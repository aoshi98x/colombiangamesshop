// src/pages/TournamentsPage.jsx
import { useTournaments } from '../hooks/useTournaments';
import placeholderImg from '../assets/torneos-placeholder.jpg';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Trophy, 
    Users, 
    Ticket, 
    ExternalLink, 
    MessageCircle,
    Swords,
    Sparkles,
    Loader2
} from 'lucide-react';

export const TournamentsPage = () => {
    const { tournaments, loading } = useTournaments();

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            {/* Cabecera / Hero */}
            <div className="bg-gradient-to-b from-white to-slate-100/60 border-b border-slate-200 py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-cg-blue border border-sky-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                        <Swords className="w-3.5 h-3.5" />
                        Comunidad Competitiva
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Torneos & Eventos TCG
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
                        Demuestra tu nivel, compite por grandes premios y comparte con la mejor comunidad de juegos de cartas coleccionables de Colombia.
                    </p>
                </div>
            </div>

            {/* Contenido Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin text-cg-blue mb-3" />
                        <p className="text-sm font-semibold">Cargando información de torneos...</p>
                    </div>
                ) : tournaments.length === 0 ? (
                    /* Vista Próximamente / Sin torneos activos */
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-center">
                        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
                            <img
                                src={placeholderImg}
                                alt="Comunidad jugando torneos en Colombian Games"
                                className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center pb-6">
                                <span className="bg-cg-blue text-white font-black text-xs sm:text-sm uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                                    ¡Próximas Fechas por Anunciar!
                                </span>
                            </div>
                        </div>

                        <div className="p-8 sm:p-10">
                            <div className="w-12 h-12 bg-sky-50 text-cg-blue rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                                Torneos Próximamente
                            </h2>
                            <p className="text-slate-600 text-sm max-w-lg mx-auto mt-3 leading-relaxed">
                                Estamos cuadrando el calendario de las próximas ligas y torneos oficiales de 
                                <strong> Pokémon, Yu-Gi-Oh!, One Piece y Magic</strong>.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <a
                                    href="https://wa.me/573000000000?text=Hola%20Colombian%20Games,%20quisiera%20saber%20cuándo%20será%20el%20próximo%20torneo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-transform active:scale-95 shadow-sm"
                                >
                                    <MessageCircle className="w-4 h-4 fill-current" />
                                    Preguntar por WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Cuadrícula de Torneos Activos */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tournaments.map((torneo) => (
                            <div 
                                key={torneo.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-cg-blue/50 transition-all flex flex-col group"
                            >
                                {torneo.image ? (
                                    <div className="h-48 overflow-hidden bg-slate-100 relative">
                                        <img 
                                            src={torneo.image} 
                                            alt={torneo.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className="absolute top-3 left-3 bg-cg-blue text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase shadow-sm">
                                            {torneo.tcg}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-cg-blue to-sky-600 p-4 text-white flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded">
                                            {torneo.tcg}
                                        </span>
                                        <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                            {torneo.status}
                                        </span>
                                    </div>
                                )}

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-cg-blue mb-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Formato: {torneo.format}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-cg-blue transition-colors mb-3">
                                        {torneo.name}
                                    </h3>

                                    {torneo.description && (
                                        <p className="text-slate-500 text-xs mb-4 line-clamp-2">
                                            {torneo.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 text-xs text-slate-600 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span><strong>Fecha:</strong> {torneo.date}</span>
                                        </div>
                                        {torneo.time && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span><strong>Hora:</strong> {torneo.time}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="truncate"><strong>Lugar:</strong> {torneo.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Ticket className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span><strong>Inscripción:</strong> {torneo.entryFee}</span>
                                        </div>
                                        {torneo.prizes && (
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                                                <span className="truncate"><strong>Premios:</strong> {torneo.prizes}</span>
                                            </div>
                                        )}
                                        {torneo.maxPlayers && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span><strong>Cupos:</strong> {torneo.maxPlayers}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-2">
                                        {torneo.registrationLink ? (
                                            <a
                                                href={torneo.registrationLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-cg-blue hover:bg-cg-blue-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs"
                                            >
                                                <span>Inscribirme Ahora</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        ) : (
                                            <a
                                                href={`https://wa.me/573000000000?text=${encodeURIComponent(`Hola Colombian Games, me interesa inscribirme al torneo: ${torneo.name}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                                <span>Inscribirme por WhatsApp</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

