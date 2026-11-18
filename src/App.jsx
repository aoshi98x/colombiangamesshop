// src/App.jsx
import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductCard } from './components/ProductCard';
import { HowToBuySection } from './components/HowToBuySection';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetail } from './pages/ProductDetail';
import { AdminPanel } from './pages/AdminPanel';
import { TournamentsPage } from './pages/TournamentsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ContactPage } from './pages/ContactPage';
import { useProducts } from './hooks/useProducts';
import { Rocket, Handshake, MessageSquare, Loader2, MessageCircle } from 'lucide-react';
import logoImg from './assets/logo.png';

function StoreContent() {
  const { products, loading, error } = useProducts();
  const [selectedTcg, setSelectedTcg] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const tcgCategories = ['Todos', ...new Set(products.map(p => p.tcg))];

  const filteredProducts = products.filter(product => {
    const matchesTcg = selectedTcg === 'Todos' || product.tcg === selectedTcg;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.expansion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTcg && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTcg={selectedTcg}
        setSelectedTcg={setSelectedTcg}
        tcgCategories={tcgCategories}
      />
      <CartDrawer />

      <div className="flex-grow">
        <Routes>
          {/* Página Principal */}
          <Route path="/" element={
            <>
              <HeroCarousel />

              {/* Franja de 3 Beneficios */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-cg-blue">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-base">Pago Contra Entrega</h3>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                        ¡Tenemos la opción de que pagues en casa!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-cg-blue">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-base">Garantía de Productos</h3>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                        Al ser distribuidores autorizados, contamos con garantía de lo que compras.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-cg-blue">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-base">Soporte Activo</h3>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                        Puedes comunicarte a nuestros canales y en menos de 48 horas ¡tendrás una respuesta!
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Catálogo */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full border-t border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    {selectedTcg === 'Todos' ? 'Catálogo Destacado' : `Productos de ${selectedTcg}`}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {tcgCategories.map(tcg => (
                      <button
                        key={tcg}
                        onClick={() => setSelectedTcg(tcg)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedTcg === tcg
                          ? 'bg-cg-blue text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {tcg}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                    <Loader2 className="w-9 h-9 animate-spin text-cg-blue mb-2" />
                    <p className="text-sm">Cargando inventario...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-rose-600 bg-rose-50 rounded-xl border border-rose-200 text-sm">
                    {error}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-sm">
                    No se encontraron productos que coincidan con tu búsqueda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Sección Cómo Comprar */}
                <HowToBuySection />
              </main>
            </>
          } />

          {/* Vista Puntual de Producto */}
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
          <Route path="/torneos" element={<TournamentsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={logoImg} alt="Colombian Games" className="h-7 w-auto object-contain" />
          <p className="font-semibold text-slate-700 text-sm">Colombian Games ¡Hobbies y más!</p>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-600 my-2">
          <a href="https://instagram.com/cgames.shop" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
            Instagram
          </a>
          <span>•</span>
          <a href="https://www.facebook.com/colombiangameshop" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            Facebook
          </a>
          <span>•</span>
          <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">
            WhatsApp
          </a>
        </div>
        <p>© 2026 Todos los derechos reservados • Bogotá, Colombia</p>
      </footer>

      {/* Botón Flotante WhatsApp */}
      <a
        href="https://wa.me/573000000000"
        target="_blank"
        rel="noopener noreferrer"
        title="Chatea con nosotros por WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <StoreContent />
      </HashRouter>
    </CartProvider>
  );
}