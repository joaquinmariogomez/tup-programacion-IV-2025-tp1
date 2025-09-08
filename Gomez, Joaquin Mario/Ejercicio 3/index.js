import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let tareas = [];

// Crear tarea
app.post("/tareas", (req, res) => {
const { nombre, estado } = req.body;
if (
    typeof nombre !== "string" ||
    nombre.trim() === "" ||
    nombre.trim().length > 100
) {
    return res
        .status(400)
        .json({ success: false, message: "El campo 'nombre' es obligatorio" });
}
if (estado !== undefined && typeof estado !== "boolean") {
    return res
        .status(400)
        .json({ success: false, message: "El campo 'estado' debe ser booleano" });
}
    const nombreTarea = nombre.trim().toLowerCase();
    const existe = tareas.some(
    (t) => t.nombre.trim().toLowerCase() === nombreTarea
);
if (existe) {
    return res
        .status(409)
        .json({ success: false, message: "Ya existe una tarea con ese nombre" });
}
    const nueva = { nombre: nombre.trim(), estado: estado ?? false };
tareas.push(nueva);
    return res.status(201).json({ success: true, data: nueva });
});

// Listar tareas (con filtro opcional)
app.get("/tareas", (req, res) => {
let tareasFiltradas = [...tareas];

// filtro por estado (true/false)
const estado = req.query.estado;
if (estado) {
    if (estado !== "true" && estado !== "false") {
    return res.status(400).json({
        success: false,
        message: "Filtro 'estado' inválido (use true o false)",
    });
    }

    const valorEstado = estado === "true";
    tareasFiltradas = tareasFiltradas.filter((t) => t.estado === valorEstado);
}

    return res.json({ success: true, data: tareasFiltradas });
});

app.listen(port, () => {
    console.log("Servidor en puerto:", port);
});
