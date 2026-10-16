require('dotenv').config(); // Cargar variables de entorno desde un archivo .env
const bodyParser = require('body-parser'); // Middleware para parsear el cuerpo de las solicitudes
const fs = require('fs'); // Módulo para trabajar con el sistema de archivos
const path = require('path'); // Módulo para trabajar con rutas de archivos y directorios

const usersFilePath = path.join(__dirname, 'users.json'); // Ruta al archivo JSON que contiene los usuarios
// /expressjs/users.json --- lo que hace es unir la ruta del directorio actual con el nombre del archivo users.json

//Estructura basica, crear express, definir puerto y escuchar peticiones
const express = require('express');

const {isValidUser} = require("./utils/validation");
const errorHandler = require('./middlewares/errorHandler');
const loggerMiddleware = require('./middlewares/logger');

const app = express();
app.use(bodyParser.json()); // Configurar body-parser para parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Configurar body-parser para parsear datos de formularios
//pasar a binario para que se puedan recibir archivos, imagenes, videos, etc
//pasar los middleware, preferible uno por archivo / buena practica
app.use(loggerMiddleware);
app.use(errorHandler);
const PORT = process.env.PORT || 3000; // Definir el puerto en el que se 
// ejecutará la aplicación, se encripta la real y de alternativa la default 3000

// Definir una ruta de ejemplon
app.get('/', (req, res) => {
  res.send(`
    <h1>Clase de Express.js v3</h1> 
    <p>Bienvenido a la clase de Express.js</p>
    <p>Servidor corriendo en el puerto ${PORT}</p>
    `);
});

app.get("/users/:id", (req, res) => {   //path param - :id - parametro de ruta
  const userID = req.params.id; // Obtener el valor del parámetro de ruta "id"
  res.send(`Mostrar usuario con ID: ${userID}`); // "Mostrar usuario con ID: ${userID}"
});

app.get("/search", (req, res) => { //query param - ?name=valor&age=valor
  const terms = req.query.termino || "No se proporcionó un término de búsqueda"; "termino: unknown word"
  const category = req.query.categoria || "No se proporcionó una categoría"; "categoria: unknown word"
  res.send(`
    <h2>Resultados de búsqueda</h2>
    <p>Término de búsqueda: ${terms}</p>
    <p>Categoría: ${category}</p>
  `);
});

app.post("/form", (req, res) => {
  const name = req.body.name || "Anonimo"; // Obtener el valor del campo "name" del cuerpo de la solicitud
  const email = req.body.email || "No proporcionado";
  res.json({
    message: "Formulario recibido",
    data: {
      name,
      email,
    },
  });
});

app.post("/api/data", (req, res) => {
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No se proporcionaron datos" });
  }
  res.status(201).json({
    message: "Datos recibidos correctamente", data
  });
});

app.get("/users", (req, res) => {
  fs.readFile(usersFilePath, 'utf8', (err, data) => { // Leer el archivo JSON de usuarios de forma asíncrona
    //utf8 - para que se pueda leer el archivo en formato de texto sin problemas de codificación ni interpretación de caracteres especiales
    if (err) {
      return res.status(500).json({ error: "Error al leer el archivo de usuarios" }); // res poque es la respuesta que se envia al cliente, 
      // status 500 porque es un error interno del servidor
    }
    const users = JSON.parse(data);
    /*let usersHTML = '<h2>Lista de usuarios</h2><ul>';
    users.forEach(user => {
      usersHTML += `<li>${user.name} - ${user.email}</li>`;
    });
    res.send(usersHTML); // Enviar la lista de usuarios en formato HTML en lugar de responder con JSON*/
    res.json(users); // Enviar la lista de usuarios en formato JSON

  });
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  // Lógica para agregar el nuevo usuario
  fs.readFile(usersFilePath, 'utf8', (err, data) => { // Leer el archivo JSON de usuarios de forma asíncrona
    if (err) {
      return res
      .status(500)
      .json({ error: "Error al leer el archivo de usuarios" });
    }
    const users = JSON.parse(data);

    const validation = isValidUser(newUser, users);
    if(!validation.valid){
      return res.status(400).json({error: validation.error});
    }
    users.push(newUser);
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => { // Escribir el archivo JSON de usuarios de forma asíncrona
      if (err) {
        return res
        .status(500)
        .json({ error: "Error al escribir en el archivo de usuarios" });
      }
      res.status(201).json(newUser); // Responder con el nuevo usuario agregado en formato JSON
    });
  });
});

app.put("/users/:id", (req, res) => {
  const userID = parseInt(req.params.id, 10);
  const updatedUser = req.body;
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res
      .status(500)
      .json({ error: "Error al leer el archivo de usuarios" });
    }
    let users = JSON.parse(data);
    users = users.map(user=>
      user.id === userID?{...user, ...updatedUser}:user,
    );
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => { // Escribir el archivo JSON de usuarios de forma asíncrona
      if (err) {
        return res
        .status(500)
        .json({ error: "Error al escribir en el archivo de usuarios" });
      }
      res.json(updatedUser); // Responder con el nuevo usuario agregado en formato JSON
    });
  });   
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  fs.readFile(usersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer el archivo de usuarios" });
    }
    let users = JSON.parse(data);
    users = users.filter((user) => user.id !== userId);
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar el usuario" });
      }
      res.status(204).send();
    });
  });
});

app.get ("/error", (req, res, next) => {
  next(new Error("Error intencional"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});