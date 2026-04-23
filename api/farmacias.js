export default async function handler(req, res) {

  const URL = "https://datosabiertos.dipcas.es/api/explore/v2.1/catalog/datasets/ubicacion-y-disponibilidad-de-las-farmacias-de-guardia-en-la-provincia-de-castel/records?limit=100";

  res.setHeader(
    "Cache-Control",
    "s-maxage=3600, stale-while-revalidate"
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
        nombre: e.nombre_farmacia || e.nombre || "Farmacia",
        direccion: e.direccion,
        cp: e.codigo_postal,
        telefono: e.telefono,
        horario: e.horario,
        lat: e.geo_point_2d?.lat,
        lon: e.geo_point_2d?.lon
      }));

    res.status(200).json({
      fecha: hoy,
      total: farmacias.length,
      farmacias
    });

  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
}