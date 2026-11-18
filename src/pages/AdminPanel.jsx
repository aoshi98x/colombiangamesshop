import { useState } from 'react';
import { useProducts, formatCOP, FALLBACK_IMAGE } from '../hooks/useProducts';
import { Lock, Plus, Save, Trash2, RefreshCw, CheckCircle2, AlertCircle, LogOut, PackagePlus, Edit3 } from 'lucide-react';
import logoImg from '../assets/logo.png';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbRTgtBgG6mEURxF44CsSZ3cSas8JY_M5-26lZnkUcIeaLaAHjwq6REpoEFrbBZxc8/exec";

export const AdminPanel = () => {
    const { products, loading } = useProducts();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [savingId, setSavingId] = useState(null);
    const [statusMsg, setStatusMsg] = useState(null);
    const [localEdits, setLocalEdits] = useState({});

    const [editingDetailId, setEditingDetailId] = useState(null);

    const [showNewForm, setShowNewForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        tcg: 'Pokémon',
        expansion: '',
        rarity: '',
        condition: 'NM (Near Mint)',
        price: '',
        stock: '1',
        images: '',
        description: ''
    });

    const handleLogin = (e) => {
        e.preventDefault();
        if (password.trim().length > 0) {
            setIsAuthenticated(true);
        }
    };

    const sendToScript = async (payload) => {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ ...payload, password }),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });
        return await response.json();
    };

    const handleFieldChange = (id, field, value) => {
        setLocalEdits((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || products.find((p) => p.id === id)),
                [field]: value,
            },
        }));
    };

    const handleUpdateProduct = async (product) => {
        const edited = localEdits[product.id] || product;
        setSavingId(product.id);
        setStatusMsg(null);

        const payloadProduct = {
            ...edited,
            images: Array.isArray(edited.images) ? edited.images.join(', ') : edited.images
        };

        try {
            const res = await sendToScript({ action: 'update', product: payloadProduct });
            if (res.status === 'success') {
                setStatusMsg({ type: 'success', text: `✔ "${edited.name}" actualizado correctamente.` });
                setEditingDetailId(null);
            } else {
                setStatusMsg({ type: 'error', text: `Error: ${res.message}` });
                if (res.message.includes('Contraseña')) setIsAuthenticated(false);
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Error de conexión con Google Sheets.' });
        } finally {
            setSavingId(null);
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setSavingId('new');
        setStatusMsg(null);

        try {
            const res = await sendToScript({ action: 'add', product: newProduct });
            if (res.status === 'success') {
                setStatusMsg({ type: 'success', text: `✔ Producto publicado con éxito.` });
                setNewProduct({
                    name: '', tcg: 'Pokémon', expansion: '', rarity: '',
                    condition: 'NM (Near Mint)', price: '', stock: '1', images: '', description: ''
                });
                setShowNewForm(false);
            } else {
                setStatusMsg({ type: 'error', text: `Error: ${res.message}` });
                if (res.message.includes('Contraseña')) setIsAuthenticated(false);
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'No se pudo publicar el producto.' });
        } finally {
            setSavingId(null);
        }
    };

    const handleDeleteProduct = async (id, name) => {
        if (!window.confirm(`¿Seguro que deseas eliminar "${name}"?`)) return;
        setSavingId(id);
        try {
            const res = await sendToScript({ action: 'delete', id });
            if (res.status === 'success') {
                setStatusMsg({ type: 'success', text: `✔ "${name}" eliminado.` });
            } else {
                setStatusMsg({ type: 'error', text: `Error: ${res.message}` });
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Error al eliminar.' });
        } finally {
            setSavingId(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto my-20 px-4">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-5">
                    <img src={logoImg} alt="Colombian Games" className="h-16 w-auto mx-auto object-contain" />
                    <div className="text-center">
                        <h1 className="text-xl font-black text-slate-800">Acceso Administrador</h1>
                        <p className="text-xs text-slate-500 mt-1">Colombian Games Shop</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Contraseña Maestra</label>
                        <input
                            type="password" required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cg-blue"
                        />
                    </div>
                    <button type="submit" className="w-full bg-cg-blue hover:bg-cg-blue-dark text-white font-bold py-3 rounded-lg text-sm cursor-pointer">
                        Ingresar al Panel
                    </button>
                </form>
            </div>
        );
    }

    const productBeingEdited = products.find(p => p.id === editingDetailId);
    const currentEditValues = productBeingEdited ? (localEdits[editingDetailId] || productBeingEdited) : null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Panel de Administración</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Gestión de inventario, stock e imágenes múltiples</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => { setShowNewForm(!showNewForm); setEditingDetailId(null); }}
                        className="bg-cg-blue hover:bg-cg-blue-dark text-white font-bold px-4 py-2.5 rounded-lg text-xs uppercase flex items-center gap-2 cursor-pointer"
                    >
                        <PackagePlus className="w-4 h-4" />
                        {showNewForm ? 'Cerrar' : 'Nuevo Producto'}
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refrescar
                    </button>

                    <button
                        onClick={() => { setIsAuthenticated(false); setPassword(''); }}
                        className="text-rose-600 hover:bg-rose-50 font-semibold px-3 py-2.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Salir
                    </button>
                </div>
            </div>

            {statusMsg && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <span>{statusMsg.text}</span>
                </div>
            )}

            {showNewForm && (
                <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-xl border border-cg-blue/40 shadow-md mb-8 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Publicar Nuevo Producto</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-1">Nombre *</label>
                            <input type="text" required placeholder="Ej: Blue-Eyes White Dragon" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">TCG *</label>
                            <select value={newProduct.tcg} onChange={(e) => setNewProduct({ ...newProduct, tcg: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                                <option value="Pokémon">Pokémon</option>
                                <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
                                <option value="One Piece">One Piece</option>
                                <option value="Magic: The Gathering">Magic: The Gathering</option>
                                <option value="Accesorios">Accesorios</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Condición</label>
                            <input type="text" placeholder="NM, LP, Sellado..." value={newProduct.condition} onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Expansión</label>
                            <input type="text" placeholder="Ej: 25th Anniversary" value={newProduct.expansion} onChange={(e) => setNewProduct({ ...newProduct, expansion: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Rareza</label>
                            <input type="text" placeholder="Ej: Secret Rare" value={newProduct.rarity} onChange={(e) => setNewProduct({ ...newProduct, rarity: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Precio (COP) *</label>
                            <input type="number" required min="0" placeholder="150000" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Stock *</label>
                            <input type="number" required min="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-1">URLs de Imágenes (Opcional, separadas por comas)</label>
                            <input type="text" placeholder="https://img1.jpg, https://img2.jpg" value={newProduct.images} onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-1">Descripción</label>
                            <input type="text" placeholder="Detalles de la carta..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer">
                            <Plus className="w-4 h-4" /> Guardar Producto
                        </button>
                    </div>
                </form>
            )}

            {editingDetailId && currentEditValues && (
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-cg-blue shadow-lg mb-8 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                        <h2 className="text-lg font-bold text-slate-900">Editando Detallado: #{currentEditValues.id} - {currentEditValues.name}</h2>
                        <button onClick={() => setEditingDetailId(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800">Cerrar</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-1">Nombre</label>
                            <input type="text" value={currentEditValues.name} onChange={(e) => handleFieldChange(editingDetailId, 'name', e.target.value)} className="w-full border bg-white rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Precio (COP)</label>
                            <input type="number" value={currentEditValues.price} onChange={(e) => handleFieldChange(editingDetailId, 'price', e.target.value)} className="w-full border bg-white rounded-lg px-3 py-2 text-sm font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Stock</label>
                            <input type="number" value={currentEditValues.stock} onChange={(e) => handleFieldChange(editingDetailId, 'stock', e.target.value)} className="w-full border bg-white rounded-lg px-3 py-2 text-sm font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Condición</label>
                            <input type="text" value={currentEditValues.condition} onChange={(e) => handleFieldChange(editingDetailId, 'condition', e.target.value)} className="w-full border bg-white rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Expansión / Set</label>
                            <input type="text" value={currentEditValues.expansion} onChange={(e) => handleFieldChange(editingDetailId, 'expansion', e.target.value)} className="w-full border bg-white rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-xs font-bold text-slate-600 mb-1">URLs de Imágenes (Separadas por comas)</label>
                            <input
                                type="text"
                                value={Array.isArray(currentEditValues.images) ? currentEditValues.images.join(', ') : currentEditValues.images}
                                onChange={(e) => handleFieldChange(editingDetailId, 'images', e.target.value)}
                                className="w-full border bg-white rounded-lg px-3 py-2 text-sm font-mono text-xs"
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-xs font-bold text-slate-600 mb-1">Descripción</label>
                            <textarea value={currentEditValues.description} onChange={(e) => handleFieldChange(editingDetailId, 'description', e.target.value)} rows="2" className="w-full border bg-white rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setEditingDetailId(null)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Cancelar</button>
                        <button
                            onClick={() => handleUpdateProduct(currentEditValues)}
                            disabled={savingId === editingDetailId}
                            className="px-6 py-2 bg-cg-blue hover:bg-cg-blue-dark text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                            <Save className="w-4 h-4" /> {savingId === editingDetailId ? 'Guardando...' : 'Guardar Cambios Completos'}
                        </button>
                    </div>
                </div>
            )}

            {/* Tabla Principal */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                            <th className="p-4">Producto</th>
                            <th className="p-4">TCG</th>
                            <th className="p-4">Precio (COP)</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">Cargando inventario...</td></tr>
                        ) : (
                            products.map((product) => {
                                const current = localEdits[product.id] || product;
                                const isModified = Boolean(localEdits[product.id]);
                                const thumbnail = Array.isArray(current.images) && current.images.length > 0 ? current.images[0] : FALLBACK_IMAGE;

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50/70">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={thumbnail}
                                                    alt={product.name}
                                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                                                    className="w-10 h-12 object-contain rounded bg-slate-100 p-0.5 border"
                                                />
                                                <div>
                                                    <span className="font-bold text-slate-800 block">{current.name}</span>
                                                    <span className="text-xs text-slate-400">ID #{product.id} • {Array.isArray(current.images) ? current.images.length : 1} foto(s)</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="text-xs font-bold text-cg-blue block">{product.tcg}</span>
                                        </td>

                                        <td className="p-4">
                                            <input
                                                type="number"
                                                value={current.price}
                                                onChange={(e) => handleFieldChange(product.id, 'price', e.target.value)}
                                                className="w-32 border rounded px-2 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:border-cg-blue"
                                            />
                                        </td>

                                        <td className="p-4">
                                            <input
                                                type="number" min="0"
                                                value={current.stock}
                                                onChange={(e) => handleFieldChange(product.id, 'stock', e.target.value)}
                                                className={`w-20 border rounded px-2 py-1 text-sm font-bold ${Number(current.stock) === 0 ? 'bg-rose-50 text-rose-700' : ''}`}
                                            />
                                        </td>

                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => setEditingDetailId(product.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                                title="Editar imágenes y detalles avanzados"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" /> Editar
                                            </button>

                                            <button
                                                onClick={() => handleUpdateProduct(current)}
                                                disabled={savingId === product.id}
                                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${isModified ? 'bg-cg-blue text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                                                    }`}
                                            >
                                                <Save className="w-3.5 h-3.5" /> Guardar
                                            </button>

                                            <button
                                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                                className="inline-flex items-center p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};