// api/aplicaciones.js
// POST: guarda una aplicación a vacante
// Las aplicaciones también llegan a tu correo por Formspree
// pero aquí también quedan guardadas en la base de datos

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { vacante, nombre, email, telefono, mensaje } = req.body;

    if (!vacante || !nombre || !email || !telefono) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: vacante, nombre, email, telefono'
      });
    }

    const { data, error } = await supabase
      .from('vacantes_aplicaciones')
      .insert([{
        vacante: vacante.trim(),
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        mensaje: mensaje ? mensaje.trim() : null,
        revisada: false
      }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      mensaje: 'Aplicación recibida. Te contactaremos pronto.',
      data: data[0]
    });
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
