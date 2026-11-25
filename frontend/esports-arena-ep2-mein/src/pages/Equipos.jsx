
import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

function TarjetaEquipo({ equipo }) {
  return (
    <article className="arena-equipo-card h-100">

      {/* ENCABEZADO DEL EQUIPO */}

      <div className="arena-equipo-header">

        <div className="arena-equipo-avatar">
          {equipo.nombre
            .split(' ')
            .filter(Boolean)
            .map(palabra => palabra[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>

        <h3>{equipo.nombre}</h3>

        <p className="arena-equipo-juego">
          Juego: {equipo.juegoPrincipalId === 1
            ? 'Valorant'
            : `Juego ID: ${equipo.juegoPrincipalId}`}
        </p>

      </div>

      {/* INFORMACIÓN DEL EQUIPO */}

      <div className="arena-equipo-body">

        <div className="arena-equipo-fila">

          <span>Capitán:</span>

          <strong>
            {equipo.nombreCapitan}
          </strong>

        </div>

        <div className="arena-equipo-fila">

          <span>Estado:</span>

          <span
            className={
              equipo.estado === 'ACTIVO'
                ? 'arena-equipo-estado text-success'
                : 'arena-equipo-estado text-danger'
            }
          >
            {equipo.estado}
          </span>

        </div>

      </div>

    </article>
  );
}

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarEquipos() {
      try {
        setCargando(true);
        setError('');

        const token = localStorage.getItem('token');

        const respuesta = await fetch(
          `${API}/api/v2/equipos/estado/ACTIVO`
        );

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los equipos.');
        }

        const listaEquipos = await respuesta.json();

        // Buscar los capitanes sin repetir solicitudes
        const idsCapitanes = [
          ...new Set(listaEquipos.map(e => e.capitanId))
        ];

        const capitanes = {};

        await Promise.all(
          idsCapitanes.map(async (id) => {
            try {
              const respuestaUsuario = await fetch(
                `${API}/api/v2/usuarios/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              if (!respuestaUsuario.ok) {
                throw new Error('No se pudo cargar el capitán');
              }

              const usuario = await respuestaUsuario.json();

              capitanes[id] =
                usuario.nombre ||
                usuario.nickname ||
                `Usuario ${id}`;

            } catch {
              capitanes[id] = `Usuario ${id}`;
            }
          })
        );

        const equiposCompletos = listaEquipos.map(equipo => ({
          ...equipo,
          nombreCapitan:
            capitanes[equipo.capitanId] ||
            `Usuario ${equipo.capitanId}`
        }));

        setEquipos(equiposCompletos);

      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEquipos();
  }, []);

  return (
    <main className="arena-equipos-page">

      <section>

        {/* ENCABEZADO DE PÁGINA */}

        <div className="arena-page-heading">

          <span className="arena-label">
            ESPORTS ARENA / COMUNIDAD
          </span>

          <h2>Equipos registrados</h2>

          <p>
            Revisa los equipos registrados en eSports Arena Manager.
          </p>

        </div>

        {/* ESTADO DE CARGA */}

        {cargando && (
          <div className="arena-torneo-message">
            <p>Cargando equipos...</p>
          </div>
        )}

        {/* MENSAJE DE ERROR */}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* LISTA VACÍA */}

        {!cargando && !error && equipos.length === 0 && (
          <div className="arena-torneo-message">
            <p>No hay equipos activos registrados.</p>
          </div>
        )}

        {/* LISTADO DE EQUIPOS REALES */}

        {!cargando && !error && (
          <div className="arena-equipos-grid">

            {equipos.map(equipo => (
              <div key={equipo.equipoId}>

                <TarjetaEquipo equipo={equipo} />

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}
