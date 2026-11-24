
import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

function TarjetaRanking({ equipo }) {
  return (
    <article className="h-100">
      <h3>
        #{equipo.posicion} - {equipo.nombre}
      </h3>

      <p>Puntos: {equipo.puntos}</p>
      <p>Victorias: {equipo.victorias}</p>
      <p>Derrotas: {equipo.derrotas}</p>
    </article>
  );
}

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarRanking() {
      try {
        const token = localStorage.getItem('token');

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        // Obtener rankings desde el backend
        const respuestaRanking = await fetch(
          `${API}/api/v2/rankings`,
          { headers }
        );

        if (!respuestaRanking.ok) {
          throw new Error('No se pudo obtener el ranking');
        }

        const datosRanking = await respuestaRanking.json();

        const listaRanking =
          datosRanking?._embedded?.rankingList || [];

        // Obtener equipos activos
        const respuestaEquipos = await fetch(
          `${API}/api/v2/equipos/estado/ACTIVO`,
          { headers }
        );

        if (!respuestaEquipos.ok) {
          throw new Error('No se pudieron obtener los equipos');
        }

        const datosEquipos = await respuestaEquipos.json();

        // Team Service devuelve un arreglo directamente
        const listaEquipos = Array.isArray(datosEquipos)
          ? datosEquipos
          : datosEquipos?._embedded?.equipoList || [];

        // Relacionar cada ranking con su equipo
        const rankingCompleto = listaRanking.map((registro) => {
          const equipoEncontrado = listaEquipos.find(
            (equipo) =>
              Number(equipo.equipoId) ===
              Number(registro.equipoId)
          );

          return {
            ...registro,
            nombre:
              equipoEncontrado?.nombre ||
              `Equipo ${registro.equipoId}`
          };
        });

        // Ordenar por posición
        rankingCompleto.sort(
          (a, b) => a.posicion - b.posicion
        );

        setRanking(rankingCompleto);

      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarRanking();
  }, []);

  return (
    <main className="container-fluid pagina-ranking py-4">
      <section>
        <h2>Ranking</h2>

        <p>
          Revisa la clasificación de los equipos participantes.
        </p>

        {cargando && <p>Cargando ranking...</p>}

        {error && (
          <p className="text-danger">{error}</p>
        )}

        {!cargando && !error && ranking.length === 0 && (
          <p>No hay equipos registrados en el ranking.</p>
        )}

        {!cargando && !error && ranking.length > 0 && (
          <div className="row g-3">
            {ranking.map((equipo) => (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={equipo.rankingId}
              >
                <TarjetaRanking equipo={equipo} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
