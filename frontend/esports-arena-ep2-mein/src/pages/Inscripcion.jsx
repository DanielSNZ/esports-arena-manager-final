
import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

const datosIniciales = {
  torneoId: '',
  equipoId: ''
};

export function validarInscripcion(datos) {
  const errores = {};

  if (!datos.torneoId) {
    errores.torneoId = 'Debes seleccionar un torneo.';
  }

  if (!datos.equipoId) {
    errores.equipoId = 'Debes seleccionar un equipo.';
  }

  return errores;
}

export default function Inscripcion() {
  const [datos, setDatos] = useState(datosIniciales);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');

  const [torneos, setTorneos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);

        const [respuestaTorneos, respuestaEquipos] =
          await Promise.all([
            fetch(`${API}/api/v2/torneos/estado/ACTIVO`),
            fetch(`${API}/api/v2/equipos/estado/ACTIVO`)
          ]);

        if (!respuestaTorneos.ok || !respuestaEquipos.ok) {
          throw new Error('No se pudieron cargar los datos.');
        }

        const listaTorneos = await respuestaTorneos.json();
        const listaEquipos = await respuestaEquipos.json();

        setTorneos(listaTorneos);
        setEquipos(listaEquipos);

      } catch (error) {
        setTipoMensaje('danger');
        setMensaje(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatos((anteriores) => ({
      ...anteriores,
      [name]: value
    }));

    setErrores((anteriores) => ({
      ...anteriores,
      [name]: ''
    }));

    setMensaje('');
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const erroresEncontrados = validarInscripcion(datos);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    try {
      setEnviando(true);
      setMensaje('');

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error(
          'Debes iniciar sesión para inscribirte.'
        );
      }

      const nuevaInscripcion = {
        torneoId: Number(datos.torneoId),
        equipoId: Number(datos.equipoId),
        fechaInscripcion: new Date()
          .toLocaleString('sv-SE', {
            timeZone: 'America/Santiago',
            hour12: false
          })
          .replace(' ', 'T'),
        estado: 'PENDIENTE'
      };

      const respuesta = await fetch(
        `${API}/api/v2/inscripciones`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(nuevaInscripcion)
        }
      );

      if (!respuesta.ok) {
        if (respuesta.status === 409) {
          throw new Error(
            'Este equipo ya está inscrito en el torneo.'
          );
        }

        throw new Error(
          `No se pudo registrar la inscripción. Error ${respuesta.status}.`
        );
      }

      const resultado = await respuesta.json();

      setTipoMensaje('success');
      setMensaje(
        `¡Inscripción registrada correctamente! ID: ${resultado.inscripcionId}`
      );

      setDatos(datosIniciales);

    } catch (error) {
      setTipoMensaje('danger');
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="arena-inscripcion-page">

      <section>

        {/* ENCABEZADO DE PÁGINA */}

        <div className="arena-page-heading">

          <span className="arena-label">
            ESPORTS ARENA / COMPETICIÓN
          </span>

          <h2>Inscripción a torneo</h2>

          <p>
            Prepárate para tu próximo desafío competitivo.
          </p>

        </div>

        <div className="arena-inscripcion-grid">

          {/* PANEL DEL FORMULARIO */}

          <div className="arena-inscripcion-panel">

            <span className="arena-label">
              REGISTRO COMPETITIVO
            </span>

            <h3>Inscribe a tu equipo</h3>

            <p className="arena-inscripcion-description">
              Selecciona un torneo y un equipo para
              registrar tu inscripción.
            </p>

            <form
              className="arena-inscripcion-form"
              onSubmit={manejarEnvio}
              noValidate
            >

              {/* SELECCIONAR TORNEO */}

              <div className="arena-inscripcion-field">

                <label
                  htmlFor="torneoId"
                  className="form-label"
                >
                  🏆 Torneo:
                </label>

                <select
                  id="torneoId"
                  name="torneoId"
                  className={`form-select ${
                    errores.torneoId ? 'is-invalid' : ''
                  }`}
                  value={datos.torneoId}
                  onChange={manejarCambio}
                  disabled={cargando}
                >

                  <option value="">
                    Seleccione un torneo
                  </option>

                  {torneos.map((torneo) => (
                    <option
                      key={torneo.torneoId}
                      value={torneo.torneoId}
                    >
                      {torneo.nombre}
                    </option>
                  ))}

                </select>

                {errores.torneoId && (
                  <small className="text-danger">
                    {errores.torneoId}
                  </small>
                )}

              </div>

              {/* SELECCIONAR EQUIPO */}

              <div className="arena-inscripcion-field">

                <label
                  htmlFor="equipoId"
                  className="form-label"
                >
                  👥 Equipo:
                </label>

                <select
                  id="equipoId"
                  name="equipoId"
                  className={`form-select ${
                    errores.equipoId ? 'is-invalid' : ''
                  }`}
                  value={datos.equipoId}
                  onChange={manejarCambio}
                  disabled={cargando}
                >

                  <option value="">
                    Seleccione un equipo
                  </option>

                  {equipos.map((equipo) => (
                    <option
                      key={equipo.equipoId}
                      value={equipo.equipoId}
                    >
                      {equipo.nombre}
                    </option>
                  ))}

                </select>

                {errores.equipoId && (
                  <small className="text-danger">
                    {errores.equipoId}
                  </small>
                )}

              </div>

              {/* BOTÓN DE INSCRIPCIÓN */}

              <button
                type="submit"
                className="arena-inscripcion-button"
                disabled={cargando || enviando}
              >
                {enviando
                  ? 'Enviando...'
                  : 'Enviar inscripción'}
              </button>

              {mensaje && (
                <div
                  className={`alert alert-${tipoMensaje} mt-3`}
                  role="status"
                >
                  {mensaje}
                </div>
              )}

            </form>

            <div className="arena-inscripcion-note">
              🔒 Debes tener una sesión iniciada para inscribirte.
            </div>

          </div>

          {/* PANEL INFORMATIVO */}

          <aside className="arena-inscripcion-info">

            <div className="arena-inscripcion-icon">
              🏆
            </div>

            <span className="arena-label">
              COMIENZA TU DESAFÍO
            </span>

            <h3>
              EL CAMINO A LA
              <span> VICTORIA.</span>
            </h3>

            <p>
              Participa junto a tu equipo y demuestra
              tus habilidades en la arena competitiva.
            </p>

            <div className="arena-inscripcion-pasos">

              <div className="arena-inscripcion-paso">

                <span className="arena-inscripcion-numero">
                  01
                </span>

                <div>
                  <h4>Selecciona un torneo</h4>
                  <p>Elige una competición activa.</p>
                </div>

              </div>

              <div className="arena-inscripcion-paso">

                <span className="arena-inscripcion-numero">
                  02
                </span>

                <div>
                  <h4>Selecciona tu equipo</h4>
                  <p>Elige un equipo activo.</p>
                </div>

              </div>

              <div className="arena-inscripcion-paso">

                <span className="arena-inscripcion-numero">
                  03
                </span>

                <div>
                  <h4>Envía tu inscripción</h4>
                  <p>Tu solicitud quedará pendiente.</p>
                </div>

              </div>

            </div>

            <div className="arena-inscripcion-footer">
              ESPORTS ARENA MANAGER
            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}
