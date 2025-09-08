import express from "express";

const app = express();
const port = 3000;
app.use(express.json());
let alumnos = [];

const notasValidas =(notas) =>    
    Array.isArray (notas) && 
    notas.length === 3 && //valido que sean 3 notas
    notas.every((n) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 10); //validamos que sea un numero >= 0 y <= que 10.

    
        const promedio = (notas) => Math.round (notas[0]+ notas[1]+ notas[2])/3;
        const condicion = (prom) =>{
            if (prom < 6) return "reprobado";
            if (prom < 8) return "aprobado";
            return "promocionado";
        }
    const listaAlumnos = (a) => {
        const prom = promedio(a.notas)
        return{
            nombre: a.nombre,
            notas: a.notas,
            promedio: prom,
            condicion: condicion(prom),
        };
    };

app.post("/alumnos", (req, res) => {
    let { nombre, notas } = req.body;
    // Validaciones
    if (typeof nombre !== "string" || nombre.trim() === "") {
    return res
        .status(400)
        .json({ error: "Debe enviar 'nombre'" });
    }
    if (!notasValidas(notas)) {
    return res.status(400).json({
        error: "Debe enviar 'notas' con EXACTAMENTE 3 números entre 0 y 10.",
    });
    }
    // Unicidad de nombre (ignorando mayúsculas y espacios)
    const nombreNormalizado = nombre.trim().toLowerCase();
    const existe = alumnos.some(
    (a) => a.nombre.trim().toLowerCase() === nombreNormalizado
    );
    if (existe) {
    return res.status(409).json({ error: "Ya existe un alumno con ese nombre." });
    }
    // Guardamos
    const nuevo = { nombre: nombre.trim(), notas };
    alumnos.push(nuevo);
    return res.status(201).json(listaAlumnos(nuevo));
});

app.get("/alumnos", (req, res) => {
let alumnosFiltrados = [...alumnos];
const nombre = req.query.nombre;
if (nombre) {
    alumnosFiltrados = alumnosFiltrados.filter((a) =>
        a.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
}
return res.json(alumnosFiltrados.map(listaAlumnos));
});

app.put("/alumnos", (req, res) => {
    // Leer el nombre desde query param
    const queryNombre = req.query.nombre;
    if (!queryNombre || queryNombre.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Debe enviar ?nombre= en la URL"
        });
    }

    //  Buscar alumno por coincidencia parcial 
    const fragmento = queryNombre.trim().toLowerCase();
    const alumno = alumnos.find(
        (a) => a.nombre.trim().toLowerCase().includes(fragmento)
    );

    if (!alumno) {
        return res.status(404).json({
            success: false,
            message: "Alumno no encontrado"
        });
    }

    // Validaciones
    const { nombre, notas } = req.body ?? {};

    if (nombre === undefined || notas === undefined) {
        return res.status(400).json({
            success: false,
            message: "Falta algún campo (nombre y/o notas)"
        });
    }

    if (typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El campo 'nombre' está vacío o no es texto"
        });
    }

    if (!notasValidas(notas)) {
        return res.status(400).json({
            success: false,
            message: "El campo 'notas' debe ser un arreglo de EXACTAMENTE 3 números entre 0 y 10"
        });
    }

    // Verificar que el nuevo nombre no exista ya en otro alumno
    const nuevoNombreNorm = nombre.trim().toLowerCase();
    const esOtro = alumnos.some(
        (a) => a !== alumno && a.nombre.trim().toLowerCase() === nuevoNombreNorm
    );
    if (esOtro) {
        return res.status(409).json({
            success: false,
            message: "Ya existe otro alumno con ese nombre"
        });
    }

    // Actualizar alumno
    alumno.nombre = nombre.trim();
    alumno.notas = notas;

    // Respuesta
    return res.json({
        success: true,
        data: listaAlumnos(alumno)
    });
});


    app.delete("/alumnos", (req, res) => {
    const queryNombre = req.query.nombre;
    if (!queryNombre || queryNombre.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Debe enviar ?nombre= en la URL"
        });
    }

    // Buscar alumno por coincidencia parcial 
    const fragmento = queryNombre.trim().toLowerCase();
    const alumno = alumnos.find(
        (a) => a.nombre.trim().toLowerCase().includes(fragmento)
    );

    if (!alumno) {
        return res.status(404).json({
            success: false,
            message: "Alumno no encontrado"
        });
    }

    // Quitar del array 
    alumnos = alumnos.filter(
        (a) => a.nombre.trim().toLowerCase() !== alumno.nombre.trim().toLowerCase()
    );

    return res.json({
        success: true,
        data: listaAlumnos(alumno)
    });
});

// Arranque del servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});