const path = require("path");
const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

// Importando rutas
const auth = require("./routes/auth");
// Importando middlewares

const app = express();

// Usando registros con Morgan
app.use(morgan("dev"));

// Definiendo middleware layouts
app.use(expressLayouts);

// Redefiniendo la ruta de las vistas
app.set("views", path.join(__dirname, "views"));
// Archivos Estáticos
app.use(express.static(path.join(__dirname, "static")));

// Usando view engine
app.set("view engine", "ejs");
app.set("layout", "./layouts/base");

// Middleware de urlencoded
app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => { res.end("Hola"); });
// Utilizando rutas
app.use("/auth", auth);

app.set("port", 4000);
app.listen(app.get("port"), () => {
    console.log(`Funcionando en: http://localhost:${app.get("port")}`);
});