// src/hooks/useTournaments.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// URL del Google Sheet publicado en formato CSV para los torneos
// Puedes reemplazar esta constante con el enlace CSV que generes en tu Google Sheet (Archivo -> Compartir -> Publicar en la web -> CSV)
export const TOURNAMENTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTIfw7n2jEQGDUimDwOFJ9itpg2W8MBUfFk0cgMdh-OAQku3uUdtTJShYadYSWnZS5s0tXfw7EV5Q3q/pub?gid=0&single=true&output=csv";

export const useTournaments = (sheetUrl = TOURNAMENTS_CSV_URL) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si la URL es la de plantilla por defecto y no existe o queremos validar, Papaparse gestiona el fetch
    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = results.data
            .filter((item) => item.name && item.name.trim() !== '')
            .map((item, index) => ({
              id: item.id || `torneo-${index + 1}`,
              name: item.name || 'Torneo TCG',
              tcg: item.tcg || 'General',
              date: item.date || 'Fecha por confirmar',
              time: item.time || '',
              location: item.location || 'Colombian Games Shop - Bogotá',
              format: item.format || 'Estándar',
              entryFee: item.entryFee || item.price || 'Gratis',
              prizes: item.prizes || 'Premios al Top',
              maxPlayers: item.maxPlayers || '',
              status: item.status || 'Inscripciones Abiertas', // Abierta, En curso, Finalizado, Próximamente
              image: item.image || item.banner || '',
              registrationLink: item.registrationLink || item.link || '',
              description: item.description || ''
            }));

          setTournaments(parsed);
          setLoading(false);
        } catch (err) {
          console.warn("Error procesando torneos:", err);
          setTournaments([]);
          setLoading(false);
        }
      },
      error: (err) => {
        // Si no está publicado aún o da 404, dejamos torneos vacío para que muestre el placeholder amigable
        console.warn("Aviso al consultar Google Sheet de torneos:", err);
        setTournaments([]);
        setLoading(false);
      }
    });
  }, [sheetUrl]);

  return { tournaments, loading, error };
};

