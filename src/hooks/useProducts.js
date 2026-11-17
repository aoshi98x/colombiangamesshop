// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiI2uH1QaxY90b0nYFr4gCKksf7pSeRUwItlAjOSP_IpDQNcPW2rH85NnE2hc6W33BQzRqD6xTi4FH/pub?gid=0&single=true&output=csv";

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
        const parsedProducts = results.data.map((item) => ({
          id: Number(item.id),
          name: item.name || "Producto sin nombre",
          tcg: item.tcg || "Otros",
          expansion: item.expansion || "",
          rarity: item.rarity || "",
          condition: item.condition || "NM",
          price: Number(item.price) || 0,
          stock: Number(item.stock) || 0,
          image: item.image || "https://via.placeholder.com/400x400?text=Sin+Imagen",
          description: item.description || ""
        }));
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