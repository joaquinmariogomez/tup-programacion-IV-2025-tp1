import express from "express";

const app = express();
const port = 3000;
app.use(express.json());

//array donde se van a guardar los calculos
let rectangulos = [];

//Verificamos si el valor subidoes numericp
const isNumber = (v) => typeof v === "number" && Number.isFinite(v);
//funcion para determinar si es cuadrado o rectangulo
const esRectangulo = (ancho, alto) => (ancho === alto ? "cuadrado" : "rectángulo");

//POST para crear el rectangulo con sus calculos
app.post("/rectangulos", (req, res) => {
    const {ancho, alto} = req.body;
    //verificamos si es un valor numerico mayor a 0
    if (!isNumber(ancho)|| !isNumber(alto)|| ancho <= 0 || alto <= 0) {
        return res.status(400).json({
            error: "Debe enviar un ancho y alto númerico mayor a 0"
        });
    }
//calculos de perimetro y superficie
    const perimetro = 2 * (alto+ancho);
    const superficie = alto*ancho;
    //objeto item para usar sus atributos
    const item = {
    ancho,
    alto,
    perimetro,
    superficie,
    };
    //guardamos el objeto en el array
    rectangulos.push(item);

    const id = rectangulos.length-1;

    return res.status(201).json({ id, ...item, tipo: esRectangulo(ancho,alto) });
    });

    //GET para ver  la lista de los rectangulos
    app.get ("/rectangulos", (req, res)=>{
    //Mostramos los atributos del item/rectangulo
        const lista = rectangulos.map((r, id) => ({
    id,
    ...r,
    tipo: esRectangulo(r.ancho, r.alto),
}));
return res.json(lista);
});
    //GET para buscar un objeto especifico con su ID
app.get("/rectangulos/:id", (req, res) => {
    const id = Number(req.params.id);
    const r = rectangulos[id];
    if (!r) return res.status(404).json({ error: "No encontrado." });
    return res.json({ id, ...r, tipo: esRectangulo(r.ancho, r.alto) });
});

app.listen(port, () => {
    console.log("La aplicacion esta funcionando en el puerto:", port)
});