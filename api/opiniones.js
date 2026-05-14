// api/opiniones.js
// Esta es la API que maneja las opiniones
// GET: trae todas las opiniones aprobadas
// POST: guarda una opinión nueva

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async function handler(req, res) {

  // Permitir peticiones desde cualquier origen (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder al preflight de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── GET: traer opiniones aprobadas ──────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('opiniones')
      .select('id, nombre, plato, rating, comentario, created_at')
      .eq('aprobada', true)           // solo las aprobadas
      .order('created_at', { ascending: false }); // más recientes primero

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  // ── POST: guardar opinión nueva ──────────────────────
  if (req.method === 'POST') {
    const { nombre, plato, rating, comentario } = req.body;

    // Validación básica
    if (!nombre || !rating || !comentario) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: nombre, rating, comentario'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'El rating debe estar entre 1 y 5'
      });
    }

    const { data, error } = await supabase
      .from('opiniones')
      .insert([{
        nombre: nombre.trim(),
        plato: plato ? plato.trim() : null,
        rating: parseInt(rating),
        comentario: comentario.trim(),
        aprobada: false  // siempre empieza sin aprobar — tú la moderas
      }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      mensaje: '¡Opinión recibida! Aparecerá pronto después de revisión.',
      data: data[0]
    });
  }

  // Método no permitido
  return res.status(405).json({ error: 'Método no permitido' });
};
