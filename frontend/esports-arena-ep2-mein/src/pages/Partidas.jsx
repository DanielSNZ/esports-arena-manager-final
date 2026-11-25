
import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

// Obtener listas normales o HATEOAS
function obtenerLista(datos, nombreColeccion) {
  if (Array.isArray(datos)) {
    return datos;
  }

  return datos?._embedded?.[nombreColeccion] || [];
}

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

// Componente reutilizable
function TarjetaPartida({ partida }) {
  const clasesEstado = {
    PROGRAMADA: 'text-primary',
    'EN CURSO': 'text-warning',
    EN_CURSO: 'text-warning',
    FINALIZADA: 'text-success'
  };

  return (
    <article className="arena-partida-card h-100">

      {/* ENCABEZADO DE LA PARTIDA */}

      <div className="arena-partida-header">

        <h3>{partida.nombreTorneo}</h3>

        <span
          className={`arena-partida-estado ${clasesEstado[partida.estado] || ''}`}
        >
          Estado: {partida.estado}
        </span>

      </div>

      {/* EQUIPOS ENFRENTADOS */}

      <div className="arena-partida-enfrentamiento">

        {/* EQUIPO LOCAL */}

        <div className="arena-partida-equipo">

          <span className="arena-partida-posicion">
            Equipo local
          </span>

          <div className="arena-partida-avatar">
            {obtenerIniciales(partida.nombreLocal)}
          </div>

          <h4>{partida.nombreLocal}</h4>

        </div>

        {/* MARCADOR CENTRAL */}

        <div className="arena-partida-marcador">

          {partida.resultado ? (
            <>
              <strong>
                {partida.resultado.puntajeA}
                <span> : </span>
                {partida.resultado.puntajeB}
              </strong>

              <small>MARCADOR</small>
            </>
          ) : (
            <strong className="arena-partida-vs">
              VS
            </strong>
          )}

        </div>

        {/* EQUIPO VISITANTE */}

        <div className="arena-partida-equipo">

          <span className="arena-partida-posicion">
            Equipo visitante
          </span>

          <div className="arena-partida-avatar">
            {obtenerIniciales(partida.nombreVisitante)}
          </div>

          <h4>{partida.nombreVisitante}</h4>

        </div>

      </div>

      {/* INFORMACIÓN ADICIONAL */}

      <div className="arena-partida-detalles">

        {partida.resultado && (
          <>

            <div className="arena-partida-fila">

              <span>Ganador:</span>

              <strong className="text-success">
                {partida.nombreGanador}
              </strong>

            </div>

            <div className="arena-partida-fila">

              <span>Validación:</span>

              <strong>
                {partida.resultado.estadoValidacion}
              </strong>

            </div>

          </>
        )}

        <div className="arena-partida-fila">

          <span>Fecha:</span>

          <strong>
            {partida.fechaPartida?.replace('T', ' ')}
          </strong>

        </div>

      </div>

    </article>
  );
}

// Página principal de partidas
export default function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPartidas() {
      try {
        setCargando(true);
        setError('');

        const token = localStorage.getItem('token');

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        // Consultar los cuatro servicios
        const [
          respuestaPartidas,
          respuestaTorneos,
          respuestaEquipos,
          respuestaResultados
        ] = await Promise.all([
          fetch(`${API}/api/v2/partidas`, { headers }),
          fetch(`${API}/api/v2/torneos`, { headers }),
          fetch(`${API}/api/v2/equipos/estado/ACTIVO`, { headers }),
          fetch(`${API}/api/v2/resultados`, { headers })
        ]);

        if (!respuestaPartidas.ok) {
          throw new Error('No se pudieron cargar las partidas.');
        }

        if (!respuestaTorneos.ok) {
          throw new Error('No se pudieron cargar los torneos.');
        }

        if (!respuestaEquipos.ok) {
          throw new Error('No se pudieron cargar los equipos.');
        }

        if (!respuestaResultados.ok) {
          throw new Error(
            `No se pudieron cargar los resultados. Error ${respuestaResultados.status}.`
          );
        }

        // Convertir las respuestas a JSON
        const [
          datosPartidas,
          datosTorneos,
          datosEquipos,
          datosResultados
        ] = await Promise.all([
          respuestaPartidas.json(),
          respuestaTorneos.json(),
          respuestaEquipos.json(),
          respuestaResultados.json()
        ]);

        // Obtener las listas
        const listaPartidas = obtenerLista(
          datosPartidas,
          'partidaList'
        );

        const listaTorneos = obtenerLista(
          datosTorneos,
          'torneoList'
        );

        const listaEquipos = obtenerLista(
          datosEquipos,
          'equipoList'
        );

        const listaResultados = obtenerLista(
          datosResultados,
          'resultadoList'
        );

        // Relacionar partidas, equipos, torneos y resultados
        const partidasCompletas = listaPartidas.map((partida) => {
          const torneo = listaTorneos.find(
            (t) =>
              Number(t.torneoId) === Number(partida.torneoId)
          );

          const equipoLocal = listaEquipos.find(
            (e) =>
              Number(e.equipoId) ===
              Number(partida.equipoLocalId)
          );

          const equipoVisitante = listaEquipos.find(
            (e) =>
              Number(e.equipoId) ===
              Number(partida.equipoVisitanteId)
          );

          const resultado = listaResultados.find(
            (r) =>
              Number(r.partidaId) ===
              Number(partida.partidaId)
          );

          const equipoGanador = listaEquipos.find(
            (e) =>
              Number(e.equipoId) ===
              Number(resultado?.ganadorId)
          );

          return {
            ...partida,

            nombreTorneo:
              torneo?.nombre ||
              `Torneo ID: ${partida.torneoId}`,

            nombreLocal:
              equipoLocal?.nombre ||
              `Equipo ID: ${partida.equipoLocalId}`,

            nombreVisitante:
              equipoVisitante?.nombre ||
              `Equipo ID: ${partida.equipoVisitanteId}`,

            resultado: resultado || null,

            nombreGanador:
              equipoGanador?.nombre ||
              'No definido'
          };
        });

        setPartidas(partidasCompletas);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarPartidas();
  }, []);

  return (
    <main className="arena-partidas-page">

      <section>

        {/* ENCABEZADO DE PÁGINA */}

        <div className="arena-page-heading">

          <span className="arena-label">
            ESPORTS ARENA / RESULTADOS
          </span>

          <h2>Centro de partidas</h2>

          <p>
            Revisa las partidas programadas y sus resultados.
          </p>

        </div>

        {/* ESTADO DE CARGA */}

        {cargando && (
          <div className="arena-torneo-message">
            <p>Cargando partidas...</p>
          </div>
        )}

        {/* MENSAJE DE ERROR */}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* LISTA VACÍA */}

        {!cargando && !error && partidas.length === 0 && (
          <div className="arena-torneo-message">
            <p>No hay partidas registradas.</p>
          </div>
        )}

        {/* LISTADO DE PARTIDAS REALES */}

        {!cargando && !error && partidas.length > 0 && (
          <div className="arena-partidas-grid">

            {partidas.map((partida) => (
              <div key={partida.partidaId}>

                <TarjetaPartida partida={partida} />

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}
