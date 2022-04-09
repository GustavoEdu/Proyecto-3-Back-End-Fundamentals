const path = require("path");
const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const { port, secret } = require("./config");
const { connection } = require("./config/database");

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

// Test connection
connection();

app.get("/", (req, res) => { 
    return res.end("Hola"); 
});
// Utilizando rutas
app.use("/auth", auth);

app.get("/notAllowed", (req, res) => { 
    return res.render("notAllowed"); 
});
app.all("*", (req, res) => { 
    return res.render("notFound"); 
});

app.listen(port, () => {
    console.log(`Funcionando en: http://localhost:${port}`);
});