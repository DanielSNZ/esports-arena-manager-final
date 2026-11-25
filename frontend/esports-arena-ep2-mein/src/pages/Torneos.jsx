
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
    <article className="arena-torneo-card h-100">

      {/* ENCABEZADO DEL TORNEO */}

      <div className="arena-torneo-header">

        <div className="arena-torneo-top">

          <span className="arena-torneo-icon">
            🏆
          </span>

          <span
            className={`arena-torneo-estado ${clasesEstado[torneo.estado] || ''}`}
          >
            Estado: {torneo.estado}
          </span>

        </div>

        <p className="arena-torneo-juego">
          Juego: {nombreJuego}
        </p>

        <h3>{torneo.nombre}</h3>

      </div>

      {/* INFORMACIÓN DEL TORNEO */}

      <div className="arena-torneo-body">

        <div className="arena-torneo-info">

          <div>
            <span>Modalidad:</span>
            <strong>{torneo.modalidad}</strong>
          </div>

          <div>
            <span>Cupos máximos:</span>
            <strong>{torneo.cupoMaximo}</strong>
          </div>

          <div>
            <span>Fecha inicio:</span>
            <strong>
              {torneo.fechaInicio || 'Sin fecha'}
            </strong>
          </div>

          <div>
            <span>Fecha término:</span>
            <strong>
              {torneo.fechaFin || 'Sin fecha'}
            </strong>
          </div>

        </div>

        <button
          type="button"
          className="arena-torneo-button"
          disabled={!accion.habilitado}
          onClick={manejarAccion}
        >
          {accion.texto}
        </button>

      </div>

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
    <main className="arena-torneos-page">

      <section>

        {/* TÍTULO DE LA PÁGINA */}

        <div className="arena-page-heading">

          <span className="arena-label">
            ESPORTS ARENA / COMPETICIONES
          </span>

          <h2>Torneos disponibles</h2>

          <p>
            Aquí podrás revisar los torneos disponibles,
            su modalidad, fechas, cupos y estado actual.
          </p>

        </div>

        {/* ESTADO DE CARGA */}

        {cargando && (
          <div className="arena-torneo-message">
            <p>Cargando torneos...</p>
          </div>
        )}

        {/* MENSAJE DE ERROR */}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* SIN TORNEOS */}

        {!cargando && !error && torneos.length === 0 && (
          <div className="arena-torneo-message">
            <p>No hay torneos registrados.</p>
          </div>
        )}

        {/* LISTADO DE TORNEOS REALES */}

        {!cargando && !error && (
          <div className="arena-torneos-grid">

            {torneos.map(torneo => (
              <div key={torneo.torneoId}>

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
