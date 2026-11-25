
import { useEffect, useState } from 'react';
import {
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

import Home from './pages/Home.jsx';
import Registro from './pages/Registro.jsx';
import Login from './pages/Login.jsx';
import Torneos from './pages/Torneos.jsx';
import Inscripcion from './pages/Inscripcion.jsx';
import Equipos from './pages/Equipos.jsx';
import Partidas from './pages/Partidas.jsx';
import Ranking from './pages/Ranking.jsx';

import {
  obtenerSesion,
  cerrarSesionLocal
} from './utils/auth.js';

// Página protegida: exige iniciar sesión
function RutaProtegida({ children, sesion }) {
  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sesion, setSesion] = useState(() => obtenerSesion());

  // Actualizar la sesión al cambiar de página
  useEffect(() => {
    setSesion(obtenerSesion());
  }, [location.pathname]);

  // Comprobar periódicamente si el JWT venció
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSesion(obtenerSesion());
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  function cerrarSesion() {
    cerrarSesionLocal();
    setSesion(null);
    navigate('/login');
  }

  return (
    <>
      {/* NUEVA BARRA DE NAVEGACIÓN */}

      <header className="arena-topbar">

        <Link to="/" className="arena-top-logo">
          ESPORTS<span>ARENA</span>
          <small>MANAGER</small>
        </Link>

        <nav className="arena-top-nav">

          <Link
            to="/"
            className={location.pathname === '/' ? 'activo' : ''}
          >
            Inicio
          </Link>

          <Link
            to="/torneos"
            className={location.pathname === '/torneos' ? 'activo' : ''}
          >
            Torneos
          </Link>

          <Link
            to="/equipos"
            className={location.pathname === '/equipos' ? 'activo' : ''}
          >
            Equipos
          </Link>

          <Link
            to="/partidas"
            className={location.pathname === '/partidas' ? 'activo' : ''}
          >
            Partidas
          </Link>

          <Link
            to="/ranking"
            className={location.pathname === '/ranking' ? 'activo' : ''}
          >
            Ranking
          </Link>

          <Link
            to="/inscripcion"
            className={location.pathname === '/inscripcion' ? 'activo' : ''}
          >
            Inscripción
          </Link>

        </nav>

        {/* CUENTA DE USUARIO */}

        <div className="arena-top-account">

          {!sesion ? (
            <>
              <Link
                to="/registro"
                className="arena-register-link"
              >
                Registro
              </Link>

              <Link
                to="/login"
                className="arena-login-button"
              >
                Iniciar sesión
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="arena-register-link"
              >
                Mi cuenta
              </Link>

              <button
                type="button"
                className="arena-login-button"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </>
          )}

        </div>

      </header>

      {/* RUTAS DE LA APLICACIÓN */}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/registro" element={<Registro />} />

        <Route path="/login" element={<Login />} />

        <Route path="/torneos" element={<Torneos />} />

        <Route
          path="/inscripcion"
          element={
            <RutaProtegida sesion={sesion}>
              <Inscripcion />
            </RutaProtegida>
          }
        />

        <Route path="/equipos" element={<Equipos />} />

        <Route path="/partidas" element={<Partidas />} />

        <Route path="/ranking" element={<Ranking />} />

      </Routes>

      {/* PIE DE PÁGINA */}

      <footer className="text-center py-3">
        <p>eSports Arena Manager - Desarrollo FullStack II</p>
        <p>Proyecto académico 2026</p>
      </footer>

    </>
  );
}
