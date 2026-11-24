
import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

// Obtener listas normales o HATEOAS
function obtenerLista(datos, nombreColeccion) {
  if (Array.isArray(datos)) {
    return datos;
  }

  return datos?._embedded?.[nombreColeccion] || [];
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
    <article className="h-100">
      <h3>{partida.nombreTorneo}</h3>

      <p>Equipo local: {partida.nombreLocal}</p>

      <p>Equipo visitante: {partida.nombreVisitante}</p>

      <p>
        Fecha: {partida.fechaPartida?.replace('T', ' ')}
      </p>

      <p>
        Estado:{' '}
        <span className={clasesEstado[partida.estado] || ''}>
          {partida.estado}
        </span>
      </p>

      {partida.resultado && (
        <>
          <p>
            <strong>
              Marcador: {partida.resultado.puntajeA} -{' '}
              {partida.resultado.puntajeB}
            </strong>
          </p>

          <p>
            Ganador:{' '}
            <span className="text-success">
              {partida.nombreGanador}
            </span>
          </p>

          <p>
            Validación:{' '}
            {partida.resultado.estadoValidacion}
          </p>
        </>
      )}
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
    <main className="container-fluid pagina-partidas py-4">
      <section>
        <h2>Partidas</h2>

        <p>
          Revisa las partidas programadas y sus resultados.
        </p>

        {cargando && <p>Cargando partidas...</p>}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!cargando && !error && partidas.length === 0 && (
          <p>No hay partidas registradas.</p>
        )}

        {!cargando && !error && partidas.length > 0 && (
          <div className="row g-3">
            {partidas.map((partida) => (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={partida.partidaId}
              >
                <TarjetaPartida partida={partida} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
