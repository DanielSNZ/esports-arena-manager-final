

import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

function TarjetaEquipo({ equipo }) {
  return (
    <article className="h-100">
      <h3>{equipo.nombre}</h3>

      <p>
        Juego: {equipo.juegoPrincipalId === 1
          ? 'Valorant'
          : `Juego ID: ${equipo.juegoPrincipalId}`}
      </p>

      <p>
        Capitán: {equipo.nombreCapitan}
      </p>

      <p>
        Estado:{' '}
        <span
          className={
            equipo.estado === 'ACTIVO'
              ? 'text-success'
              : 'text-danger'
          }
        >
          {equipo.estado}
        </span>
      </p>
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
    <main className="container-fluid pagina-equipos py-4">
      <section>
        <h2>Equipos</h2>

        <p>
          Revisa los equipos registrados en eSports Arena Manager.
        </p>

        {cargando && <p>Cargando equipos...</p>}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!cargando && !error && equipos.length === 0 && (
          <p>No hay equipos activos registrados.</p>
        )}

        {!cargando && !error && (
          <div className="row g-3">
            {equipos.map(equipo => (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={equipo.equipoId}
              >
                <TarjetaEquipo equipo={equipo} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
