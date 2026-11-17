// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiI2uH1QaxY90b0nYFr4gCKksf7pSeRUwItlAjOSP_IpDQNcPW2rH85NnE2hc6W33BQzRqD6xTi4FH/pub?gid=0&single=true&output=csv";

// Imagen de respaldo integrada (no depende de internet ni servidores externos)
export const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%2394a3b8'>Sin Imagen</text></svg>";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedProducts = results.data.map((item) => {
          const rawImages = (item.images || item.image || "").trim();
          const imagesArray = rawImages
            ? rawImages.split(',').map(img => img.trim()).filter(img => img.startsWith('http') || img.startsWith('data:'))
            : [FALLBACK_IMAGE];

          const finalImages = imagesArray.length > 0 ? imagesArray : [FALLBACK_IMAGE];

          return {
            id: Number(item.id),
            name: item.name || "Producto sin nombre",
            tcg: item.tcg || "Otros",
            expansion: item.expansion || "",
            rarity: item.rarity || "",
            condition: item.condition || "NM",
            price: Number(item.price) || 0,
            stock: Number(item.stock) || 0,
            images: finalImages,
            image: finalImages[0],
            description: item.description || ""
          };
        });
        setProducts(parsedProducts);
        setLoading(false);
      },
      error: (err) => {
        console.error("Error cargando Google Sheet:", err);
        setError("No se pudo cargar el inventario.");
        setLoading(false);
      }
    });
  }, []);

  return { products, loading, error };
};

export const formatCOP = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};