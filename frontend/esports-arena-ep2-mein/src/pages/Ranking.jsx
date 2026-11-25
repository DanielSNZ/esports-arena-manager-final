
import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

// Generar iniciales únicamente para el diseño
function obtenerIniciales(nombre) {
  return String(nombre || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(palabra => palabra[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

// Fila de clasificación
function FilaRanking({ equipo }) {
  return (
    <tr>

      {/* POSICIÓN */}

      <td>
        <span
          className={`arena-ranking-posicion ${
            Number(equipo.posicion) === 1
              ? 'primer-lugar'
              : ''
          }`}
        >
          #{equipo.posicion}
        </span>
      </td>

      {/* EQUIPO */}

      <td>
        <div className="arena-ranking-equipo">

          <div className="arena-ranking-avatar">
            {obtenerIniciales(equipo.nombre)}
          </div>

          <strong>{equipo.nombre}</strong>

        </div>
      </td>

      {/* VICTORIAS */}

      <td className="arena-ranking-victorias">
        {equipo.victorias}
      </td>

      {/* DERROTAS */}

      <td className="arena-ranking-derrotas">
        {equipo.derrotas}
      </td>

      {/* PUNTOS */}

      <td className="arena-ranking-puntos">
        {equipo.puntos}
      </td>

    </tr>
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
    <main className="arena-ranking-page">

      <section>

        {/* ENCABEZADO DE PÁGINA */}

        <div className="arena-page-heading">

          <span className="arena-label">
            ESPORTS ARENA / CLASIFICACIÓN
          </span>

          <h2>Power Rankings</h2>

          <p>
            Revisa la clasificación de los equipos participantes.
          </p>

        </div>

        {/* ESTADO DE CARGA */}

        {cargando && (
          <div className="arena-torneo-message">
            <p>Cargando ranking...</p>
          </div>
        )}

        {/* MENSAJE DE ERROR */}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* LISTA VACÍA */}

        {!cargando && !error && ranking.length === 0 && (
          <div className="arena-torneo-message">
            <p>No hay equipos registrados en el ranking.</p>
          </div>
        )}

        {/* TABLA DE CLASIFICACIÓN */}

        {!cargando && !error && ranking.length > 0 && (
          <div className="arena-ranking-panel">

            <div className="arena-ranking-header">

              <span className="arena-label">
                CLASIFICACIÓN COMPETITIVA
              </span>

              <h3>Clasificación general</h3>

            </div>

            <div className="arena-ranking-scroll">

              <table className="arena-ranking-table">

                <thead>
                  <tr>
                    <th scope="col">Posición</th>
                    <th scope="col">Equipo</th>
                    <th scope="col">Victorias</th>
                    <th scope="col">Derrotas</th>
                    <th scope="col">Puntos</th>
                  </tr>
                </thead>

                <tbody>

                  {ranking.map((equipo) => (
                    <FilaRanking
                      key={equipo.rankingId}
                      equipo={equipo}
                    />
                  ))}

                </tbody>

              </table>

            </div>

            <div className="arena-ranking-footer">
              Clasificación de equipos · eSports Arena Manager
            </div>

          </div>
        )}

      </section>

    </main>
  );
}
