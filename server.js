const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const FILE = './data/tours.json';

// Leer datos
const leerTours = () => {
  try {
    return JSON.parse(fs.readFileSync(FILE));
  } catch {
    return [];
  }
};

// Guardar datos
const guardarTours = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

// Obtener todos
app.get('/tours', (req, res) => {
  res.json(leerTours());
});

// Obtener uno
app.get('/tours/:id', (req, res) => {
  const tours = leerTours();
  const tour = tours.find(t => t.id == req.params.id);
  res.json(tour);
});

// Agregar
app.post('/tours', (req, res) => {
  const tours = leerTours();
  const nuevo = { id: Date.now(), ...req.body };
  tours.push(nuevo);
  guardarTours(tours);
  res.json(nuevo);
});

// Editar
app.put('/tours/:id', (req, res) => {
  let tours = leerTours();
  tours = tours.map(t => t.id == req.params.id ? { ...t, ...req.body } : t);
  guardarTours(tours);
  res.json({ mensaje: "Actualizado" });
});

// Eliminar
app.delete('/tours/:id', (req, res) => {
  let tours = leerTours().filter(t => t.id != req.params.id);
  guardarTours(tours);
  res.json({ mensaje: "Eliminado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor funcionando"));