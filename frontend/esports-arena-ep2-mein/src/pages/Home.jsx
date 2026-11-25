
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [sesion] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const rol = localStorage.getItem('rol');

    return {
      token,
      email,
      rol
    };
  });

  const conectado = Boolean(sesion.token);

  return (
    <main className="arena-dashboard">

      {/* COLUMNA IZQUIERDA */}
      <aside className="arena-sidebar">

        <h2 className="arena-brand">
          ESPORTS<span>ARENA</span>
        </h2>

        <p className="arena-label">COMPETICIONES</p>

        <Link to="/torneos">Torneos disponibles</Link>
        <Link to="/equipos">Equipos registrados</Link>
        <Link to="/partidas">Partidas</Link>
        <Link to="/ranking">Clasificación</Link>

        <p className="arena-label">PARTICIPACIÓN</p>

        <Link to="/inscripcion">Inscripción a torneos</Link>

      </aside>

      {/* COLUMNA CENTRAL */}
      <div className="arena-central">

        <div className="arena-hero">

          <span className="arena-label">
            ESPORTS ARENA MANAGER
          </span>

          <h1>LA ARENA<br />COMPETITIVA</h1>

          <p>
            Consulta torneos, equipos, partidas y rankings
            en nuestra plataforma de eSports.
          </p>

          <Link to="/torneos" className="arena-button">
            EXPLORAR TORNEOS
          </Link>

        </div>

        <h2 className="arena-section-title">
          Centro de competiciones
        </h2>

        <div className="arena-options">

          <Link to="/torneos" className="arena-option">
            <span>01 / COMPETICIÓN</span>
            <h3>Torneos</h3>
            <p>Descubre los torneos disponibles.</p>
          </Link>

          <Link to="/equipos" className="arena-option">
            <span>02 / COMUNIDAD</span>
            <h3>Equipos</h3>
            <p>Consulta los equipos registrados.</p>
          </Link>

          <Link to="/partidas" className="arena-option">
            <span>03 / RESULTADOS</span>
            <h3>Partidas</h3>
            <p>Revisa los encuentros y resultados.</p>
          </Link>

          <Link to="/ranking" className="arena-option">
            <span>04 / CLASIFICACIÓN</span>
            <h3>Ranking</h3>
            <p>Consulta la clasificación de equipos.</p>
          </Link>

        </div>

        <div className="arena-panel">

          <h2>Conoce el mundo de los eSports</h2>

          <p>
            Los eSports reúnen jugadores y equipos
            en competencias organizadas de videojuegos.
          </p>

          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/IvA-cHSk9-k"
              title="Video relacionado con eSports"
              allowFullScreen
            />
          </div>

        </div>

      </div>

      {/* COLUMNA DERECHA */}
      <aside className="arena-right">

        <div className="arena-panel">

          <span className="arena-label">PERFIL</span>

          <h2>
            {conectado ? 'Mi cuenta' : 'Bienvenido, visitante'}
          </h2>

          {conectado ? (
            <>
              <p>Has iniciado sesión correctamente.</p>

              <p>
                <strong>Correo:</strong> {sesion.email}
              </p>

              <p>
                <strong>Rol:</strong> {sesion.rol}
              </p>
            </>
          ) : (
            <>
              <p>
                Inicia sesión o regístrate para participar
                en los torneos.
              </p>

              <Link to="/login" className="arena-button">
                INICIAR SESIÓN
              </Link>

              <Link to="/registro" className="arena-outline">
                CREAR CUENTA
              </Link>
            </>
          )}

        </div>

        <div className="arena-panel">

          <span className="arena-label">
            CLASIFICACIÓN
          </span>

          <h2>Power Ranking</h2>

          <p>
            Consulta la clasificación y el rendimiento
            de los equipos.
          </p>

          <Link to="/ranking" className="arena-text-link">
            Ver ranking completo →
          </Link>

        </div>

        <div className="arena-panel">

          <span className="arena-label">
            COMPETICIONES
          </span>

          <h2>Participa</h2>

          <p>
            Inscríbete en los torneos disponibles.
          </p>

          <Link to="/inscripcion" className="arena-text-link">
            Ir a inscripciones →
          </Link>

        </div>

      </aside>

    </main>
  );
}
