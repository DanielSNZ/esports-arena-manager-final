
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080';

export function obtenerAccionTorneo(torneo, perfil) {
  if (torneo.estado === 'ACTIVO') {
    return perfil === 'USER' || perfil === 'JUGADOR'
      ? { texto: 'Inscribirse', habilitado: true }
      : { texto: 'Inicia sesión para inscribirte', habilitado: false };
  }

  if (torneo.estado === 'EN_CURSO' || torneo.estado === 'EN CURSO') {
    return { texto: 'Inscripciones cerradas', habilitado: false };
  }

  if (torneo.estado === 'FINALIZADO') {
    return { texto: 'Ver resultados', habilitado: false };
  }

  return { texto: 'No disponible', habilitado: false };
}

function TarjetaTorneo({ torneo, perfil, nombreJuego }) {
  const navegar = useNavigate();
  const accion = obtenerAccionTorneo(torneo, perfil);

  const clasesEstado = {
    ACTIVO: 'estado-abierto',
    ABIERTO: 'estado-abierto',
    EN_CURSO: 'estado-curso',
    'EN CURSO': 'estado-curso',
    FINALIZADO: 'estado-finalizado'
  };

  function manejarAccion() {
    if (
      torneo.estado === 'ACTIVO' &&
      (perfil === 'USER' || perfil === 'JUGADOR')
    ) {
      navegar('/inscripcion');
    }
  }

  return (
    <article className="h-100">
      <h3>{torneo.nombre}</h3>

      <p>Juego: {nombreJuego}</p>

      <p>Modalidad: {torneo.modalidad}</p>

      <p>Cupos máximos: {torneo.cupoMaximo}</p>

      <p>
        Fecha inicio: {torneo.fechaInicio || 'Sin fecha'}
      </p>

      <p>
        Fecha término: {torneo.fechaFin || 'Sin fecha'}
      </p>

      <p className={clasesEstado[torneo.estado] || ''}>
        Estado: {torneo.estado}
      </p>

      <button
        type="button"
        disabled={!accion.habilitado}
        onClick={manejarAccion}
      >
        {accion.texto}
      </button>
    </article>
  );
}

export default function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [juegos, setJuegos] = useState({});
  const [perfil, setPerfil] = useState(
    () => localStorage.getItem('rol') || 'VISITANTE'
  );
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    function actualizarPerfil() {
      setPerfil(localStorage.getItem('rol') || 'VISITANTE');
    }

    window.addEventListener('storage', actualizarPerfil);
    window.addEventListener('focus', actualizarPerfil);

    return () => {
      window.removeEventListener('storage', actualizarPerfil);
      window.removeEventListener('focus', actualizarPerfil);
    };
  }, []);

  useEffect(() => {
    async function cargarTorneos() {
      try {
        setCargando(true);
        setError('');

        // Consultar torneos reales desde el Gateway
        const respuesta = await fetch(
          `${API}/api/v2/torneos`
        );

        if (!respuesta.ok) {
          throw new Error(
            `No se pudieron cargar los torneos. Error ${respuesta.status}.`
          );
        }

        const datos = await respuesta.json();

        // Aceptar lista normal o colección HATEOAS
        const listaTorneos = Array.isArray(datos)
          ? datos
          : datos._embedded
            ? Object.values(datos._embedded).flat()
            : [];

        setTorneos(listaTorneos);

        // Obtener nombres de juegos desde Game Service
        const idsJuegos = [
          ...new Set(
            listaTorneos
              .map(torneo => torneo.juegoId)
              .filter(id => id != null)
          )
        ];

        const nombresJuegos = {};

        await Promise.all(
          idsJuegos.map(async (id) => {
            try {
              const respuestaJuego = await fetch(
                `${API}/api/v2/juegos/${id}`
              );

              if (!respuestaJuego.ok) {
                throw new Error('No se pudo cargar el juego');
              }

              const juego = await respuestaJuego.json();

              nombresJuegos[id] =
                juego.nombre || `Juego ID: ${id}`;

            } catch {
              nombresJuegos[id] = `Juego ID: ${id}`;
            }
          })
        );

        setJuegos(nombresJuegos);

      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarTorneos();
  }, []);

  return (
    <main className="container-fluid pagina-torneos py-4">
      <section>
        <h2>Torneos disponibles</h2>

        <p>
          Aquí podrás revisar los torneos disponibles,
          su modalidad, fechas, cupos y estado actual.
        </p>

        {cargando && (
          <p>Cargando torneos...</p>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!cargando && !error && torneos.length === 0 && (
          <p>No hay torneos registrados.</p>
        )}

        {!cargando && !error && (
          <div className="row g-3">
            {torneos.map(torneo => (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={torneo.torneoId}
              >
                <TarjetaTorneo
                  torneo={torneo}
                  perfil={perfil}
                  nombreJuego={
                    juegos[torneo.juegoId] ||
                    `Juego ID: ${torneo.juegoId}`
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
