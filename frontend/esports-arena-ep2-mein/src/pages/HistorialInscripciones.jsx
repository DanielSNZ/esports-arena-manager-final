import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

export default function HistorialInscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('TODAS');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarHistorial() {
    try {
      setCargando(true);
      setError('');

      const token = localStorage.getItem('token');

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      async function consultar(ruta, clave) {
        const respuesta = await fetch(`${API}${ruta}`, { headers });

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} al consultar los datos.`);
        }

        const datos = await respuesta.json();

        return Array.isArray(datos)
          ? datos
          : datos._embedded?.[clave] || [];
      }

      const [registros, equipos, torneos] = await Promise.all([
        consultar('/api/v2/inscripciones', 'inscripcionList'),
        consultar('/api/v2/equipos', 'equipoList'),
        consultar('/api/v2/torneos', 'torneoList')
      ]);

      const historial = registros.map(inscripcion => ({
        ...inscripcion,

        nombreEquipo:
          equipos.find(e => e.equipoId === inscripcion.equipoId)?.nombre
          || `Equipo #${inscripcion.equipoId}`,

        nombreTorneo:
          torneos.find(t => t.torneoId === inscripcion.torneoId)?.nombre
          || `Torneo #${inscripcion.torneoId}`
      }));

      setInscripciones(historial);

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarHistorial();

    window.addEventListener(
      'inscripcion-actualizada',
      cargarHistorial
    );

    return () => window.removeEventListener(
      'inscripcion-actualizada',
      cargarHistorial
    );
  }, []);

  const pendientes = inscripciones.filter(
    i => i.estado === 'PENDIENTE'
  ).length;

  const confirmadas = inscripciones.filter(
    i => i.estado === 'CONFIRMADA'
  ).length;

  const estados = [...new Set(
    inscripciones.map(i => i.estado)
  )];

  const resultados = inscripciones.filter(i => {
    const texto = `${i.nombreEquipo} ${i.nombreTorneo}`
      .toLowerCase();

    return texto.includes(busqueda.toLowerCase()) &&
      (filtro === 'TODAS' || i.estado === filtro);
  });

  return (
    <div className="arena-historial">

      <span className="arena-label">
        REGISTRO COMPETITIVO
      </span>

      <h2>Historial de inscripciones</h2>

      <p>Consulta los equipos inscritos y su estado actual.</p>

      <div className="arena-historial-stats">

        <div>
          <span>Total de inscripciones</span>
          <strong>{inscripciones.length}</strong>
        </div>

        <div>
          <span>Pendientes</span>
          <strong style={{ color: '#eab308' }}>
            {pendientes}
          </strong>
        </div>

        <div>
          <span>Confirmadas</span>
          <strong style={{ color: '#22c55e' }}>
            {confirmadas}
          </strong>
        </div>

      </div>

      <div className="arena-historial-filtros">

        <input
          type="text"
          className="form-control"
          placeholder="Buscar equipo o torneo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <select
          className="form-select"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        >
          <option value="TODAS">Todos los estados</option>

          {estados.map(estado => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="arena-outline"
          onClick={cargarHistorial}
        >
          Actualizar
        </button>

      </div>

      {cargando ? (
        <p>Cargando inscripciones...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : resultados.length === 0 ? (
        <p>No se encontraron inscripciones.</p>
      ) : (
        <div className="arena-historial-lista">

          {resultados.map(i => (
            <article
              className="arena-historial-card"
              key={i.inscripcionId}
            >

              <div>
                <span className="arena-label">
                  INSCRIPCIÓN #{i.inscripcionId}
                </span>

                <h3>{i.nombreEquipo}</h3>

                <p>🏆 {i.nombreTorneo}</p>

                <small>
                  Fecha: {
                    i.fechaInscripcion
                      ? new Date(i.fechaInscripcion)
                          .toLocaleString('es-CL')
                      : 'Sin fecha'
                  }
                </small>
              </div>

              <span
                className={`arena-estado ${
                  i.estado.toLowerCase()
                }`}
              >
                {i.estado}
              </span>

            </article>
          ))}

        </div>
      )}

    </div>
  );
}