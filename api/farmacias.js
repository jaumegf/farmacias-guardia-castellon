export default async function handler(req, res) {

  const URL = "https://datosabiertos.dipcas.es/api/explore/v2.1/catalog/datasets/ubicacion-y-disponibilidad-de-las-farmacias-de-guardia-en-la-provincia-de-castel/records?limit=100";

  res.setHeader(
    "Cache-Control",
    "s-maxage=36, stale-while-revalidate"
  );

  try {
    const response = await fetch(URL);
    const json = await response.json();

    const hoy = new Date().toISOString().slice(0,10);

    const farmacias = json.results
      .filter(e =>
        e.poblacion?.toLowerCase().includes("castell")
      )
      .map(e => ({
        nombre: e.farmacia || "Farmacia",
        direccion: e.direccion,
		poblacion: e.poblacion,
        cp: e.codpostal,
        telefono: e.telefono,
        horario: e.horario,
        lat: e.coordendas?.lat,
        lon: e.coordenadas?.lon
      }));
	  

    res.status(200).json({
      fecha: hoy,
      total: farmacias.length,
	  debug: json.results[0],
      farmacias
    });

  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
}