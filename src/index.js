const path = require("path");
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const flash = require("connect-flash");
const csrf = require("csurf");
const expressLayouts = require("express-ejs-layouts");
const { port, secret } = require("./config");
const { connection } = require("./config/database");
const session = require("express-session");

// Importando rutas
const auth = require("./routes/auth");
const users = require("./routes/users");
const chats = require("./routes/chats");
// Importando middlewares
const addSessionToTemplate = require("./middleware/addSessionToTemplate");
const verifySession = require("./middleware/verifySession");

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

// Definiendo la sesión
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));

app.use(addSessionToTemplate);

// Middleware de urlencoded
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Middleware para la subida de Archivos
app.use(fileUpload());

// Definiendo middleware para flash messages
app.use(flash());

// Test connection
connection();

app.get("/", (req, res) => { 
    return res.redirect("/auth/login"); 
});
// Utilizando rutas
app.use("/auth", csrf());
app.use("/auth", auth);
app.use("/users", verifySession);
app.use("/users", users);
app.use("/chats", verifySession);
app.use("/chats", chats);

app.get("/notAllowed", (req, res) => { 
    return res.render("notAllowed"); 
});
app.all("*", (req, res) => { 
    return res.render("notFound"); 
});

app.listen(port, () => {
    console.log(`Funcionando en: http://localhost:${port}`);
});