import React, { useState, useEffect } from "react";

const API = "http://localhost:8080/api/v2";

export default function PanelOrganizador() {

    const [inscripciones, setInscripciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("TODAS");
    const [procesando, setProcesando] = useState(null);

    const rol = localStorage.getItem("rol");
    const autorizado = ["ORGANIZADOR", "ADMIN"].includes(rol);

    // Obtener los datos desde el backend
    const cargarInscripciones = async () => {

        try {
            setCargando(true);
            setError("");

            const headers = {
                Authorization: "Bearer " + localStorage.getItem("token")
            };

            const respuestas = await Promise.all([
                fetch(`${API}/inscripciones`, { headers }),
                fetch(`${API}/equipos`, { headers }),
                fetch(`${API}/torneos`, { headers })
            ]);

            if (respuestas.some(r => !r.ok)) {
                throw new Error("No se pudieron cargar los datos.");
            }

            const [datosInscripciones, datosEquipos, datosTorneos] =
                await Promise.all(respuestas.map(r => r.json()));

            const obtenerLista = (datos, clave) =>
                Array.isArray(datos)
                    ? datos
                    : datos._embedded?.[clave] || [];

            const listaInscripciones = obtenerLista(
                datosInscripciones, "inscripcionList"
            );

            const equipos = obtenerLista(
                datosEquipos, "equipoList"
            );

            const torneos = obtenerLista(
                datosTorneos, "torneoList"
            );

            const listaCompleta = listaInscripciones.map(inscripcion => {

                const equipo = equipos.find(
                    e => e.equipoId === inscripcion.equipoId
                );

                const torneo = torneos.find(
                    t => t.torneoId === inscripcion.torneoId
                );

                return {
                    ...inscripcion,
                    nombreEquipo: equipo?.nombre ||
                        `Equipo #${inscripcion.equipoId}`,
                    nombreTorneo: torneo?.nombre ||
                        `Torneo #${inscripcion.torneoId}`
                };
            });

            setInscripciones(listaCompleta);

        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (autorizado) {
            cargarInscripciones();
        }
    }, [autorizado]);

    // Confirmar o rechazar una inscripción
    const cambiarEstado = async (inscripcion, nuevoEstado) => {

        const accion = nuevoEstado === "CONFIRMADA"
            ? "confirmar"
            : "rechazar";

        if (!window.confirm(
            `¿Deseas ${accion} la inscripción de ${inscripcion.nombreEquipo}?`
        )) {
            return;
        }

        try {
            setProcesando(inscripcion.inscripcionId);
            setError("");
            setMensaje("");

            const respuesta = await fetch(
                `${API}/inscripciones/${inscripcion.inscripcionId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " +
                            localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        torneoId: inscripcion.torneoId,
                        equipoId: inscripcion.equipoId,
                        fechaInscripcion: inscripcion.fechaInscripcion,
                        estado: nuevoEstado
                    })
                }
            );

            if (respuesta.status === 401) {
                throw new Error(
                    "Tu sesión ha expirado. Inicia sesión nuevamente."
                );
            }

            if (respuesta.status === 403) {
                throw new Error(
                    "No tienes permisos para realizar esta operación."
                );
            }

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo actualizar la inscripción."
                );
            }

            const actualizada = await respuesta.json();

            setInscripciones(anterior =>
                anterior.map(item =>
                    item.inscripcionId === inscripcion.inscripcionId
                        ? { ...item, estado: actualizada.estado }
                        : item
                )
            );

            setMensaje(
                `Inscripción de ${inscripcion.nombreEquipo} ${
                    nuevoEstado === "CONFIRMADA"
                        ? "confirmada"
                        : "rechazada"
                } correctamente.`
            );

            window.dispatchEvent(
                new Event("inscripcion-actualizada")
            );

        } catch (err) {
            setError(err.message);
        } finally {
            setProcesando(null);
        }
    };

    // Estadísticas
    const pendientes = inscripciones.filter(
        i => i.estado === "PENDIENTE"
    ).length;

    const confirmadas = inscripciones.filter(
        i => i.estado === "CONFIRMADA"
    ).length;

    const rechazadas = inscripciones.filter(
        i => i.estado === "RECHAZADA"
    ).length;

    // Buscador y filtros
    const inscripcionesFiltradas = inscripciones.filter(i => {

        const texto = busqueda.toLowerCase().trim();

        const coincideBusqueda =
            i.nombreEquipo.toLowerCase().includes(texto) ||
            i.nombreTorneo.toLowerCase().includes(texto);

        const coincideEstado =
            filtro === "TODAS" || i.estado === filtro;

        return coincideBusqueda && coincideEstado;
    });

    if (!autorizado) {
        return (
            <section className="arena-organizador">
                <h1>Acceso denegado</h1>
                <p>No tienes permisos para acceder a este panel.</p>
            </section>
        );
    }

    return (

        <section className="arena-organizador">

            <div className="organizador-encabezado">

                <div>
                    <span className="arena-label">
                        CENTRO DE GESTIÓN
                    </span>

                    <h1>Panel de organizador</h1>

                    <p>
                        Administra y revisa las solicitudes
                        de inscripción a los torneos.
                    </p>
                </div>

                <div className="organizador-rol">
                    🛡️ {rol}
                </div>

            </div>

            {/* ESTADÍSTICAS */}

            <div className="organizador-estadisticas">

                <div className="organizador-stat">
                    <span>Inscripciones totales</span>
                    <strong className="stat-total">
                        {inscripciones.length}
                    </strong>
                </div>

                <div className="organizador-stat">
                    <span>Pendientes</span>
                    <strong className="stat-pendiente">
                        {pendientes}
                    </strong>
                </div>

                <div className="organizador-stat">
                    <span>Confirmadas</span>
                    <strong className="stat-confirmada">
                        {confirmadas}
                    </strong>
                </div>

                <div className="organizador-stat">
                    <span>Rechazadas</span>
                    <strong className="stat-rechazada">
                        {rechazadas}
                    </strong>
                </div>

            </div>

            {/* MENSAJES */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {mensaje && (
                <div className="alert alert-success">
                    {mensaje}
                </div>
            )}

            {/* BUSCADOR Y FILTROS */}

            <div className="organizador-filtros">

                <input
                    type="text"
                    placeholder="Buscar equipo o torneo..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />

                <select
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                >
                    <option value="TODAS">Todos los estados</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="CONFIRMADA">Confirmadas</option>
                    <option value="RECHAZADA">Rechazadas</option>
                </select>

                <button
                    className="organizador-actualizar"
                    onClick={cargarInscripciones}
                    disabled={cargando || procesando !== null}
                >
                    ↻ Actualizar
                </button>

            </div>

            <h2>Solicitudes de inscripción</h2>

            {cargando ? (

                <p>Cargando inscripciones...</p>

            ) : inscripcionesFiltradas.length === 0 ? (

                <p>No se encontraron inscripciones.</p>

            ) : (

                <div className="organizador-lista">

                    {inscripcionesFiltradas.map(inscripcion => (

                        <article
                            className="organizador-card"
                            key={inscripcion.inscripcionId}
                        >

                            <div className="organizador-card-header">

                                <div className="organizador-equipo-icono">
                                    {inscripcion.nombreEquipo
                                        .split(" ")
                                        .slice(0, 2)
                                        .map(p => p.charAt(0))
                                        .join("")
                                        .toUpperCase()}
                                </div>

                                <div className="organizador-equipo-info">

                                    <span className="arena-label">
                                        INSCRIPCIÓN #{inscripcion.inscripcionId}
                                    </span>

                                    <h3>{inscripcion.nombreEquipo}</h3>

                                    <p>
                                        🏆 {inscripcion.nombreTorneo}
                                    </p>

                                </div>

                                <span className={
                                    `organizador-estado ${
                                        inscripcion.estado.toLowerCase()
                                    }`
                                }>
                                    {inscripcion.estado}
                                </span>

                            </div>

                            <div className="organizador-fecha">
                                📅 Fecha de inscripción:{" "}
                                {new Date(
                                    inscripcion.fechaInscripcion
                                ).toLocaleString("es-CL")}
                            </div>

                            {inscripcion.estado === "PENDIENTE" ? (

                                <div className="organizador-acciones">

                                    <button
                                        className="btn-confirmar"
                                        disabled={procesando !== null}
                                        onClick={() => cambiarEstado(
                                            inscripcion, "CONFIRMADA"
                                        )}
                                    >
                                        ✓ Confirmar inscripción
                                    </button>

                                    <button
                                        className="btn-rechazar"
                                        disabled={procesando !== null}
                                        onClick={() => cambiarEstado(
                                            inscripcion, "RECHAZADA"
                                        )}
                                    >
                                        ✕ Rechazar inscripción
                                    </button>

                                </div>

                            ) : (

                                <div className="organizador-procesada">
                                    Solicitud procesada
                                </div>

                            )}

                        </article>

                    ))}

                </div>

            )}

        </section>
    );
}