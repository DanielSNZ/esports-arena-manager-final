
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
      <header className="banner-header">
        <img
          src="/img/banner-header.png"
          alt=""
          className="banner-header-imagen"
        />

        <img
          src="/img/logo-esports.png"
          alt="eSports Arena Manager - Gestión de torneos competitivos"
          className="banner-logo"
        />
      </header>

      <nav className="navbar">
        <div className="container d-flex justify-content-center gap-4 flex-wrap">

          <Link className="nav-link" to="/">
            Inicio
          </Link>

          <Link className="nav-link" to="/torneos">
            Torneos
          </Link>

          {!sesion ? (
            <>
              <Link className="nav-link" to="/registro">
                Registro
              </Link>

              <Link className="nav-link" to="/login">
                Iniciar sesión
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/">
                Mi cuenta
              </Link>

              <button
                type="button"
                className="nav-link btn btn-link"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </>
          )}

          <Link className="nav-link" to="/inscripcion">
            Inscripción
          </Link>

          <Link className="nav-link" to="/equipos">
            Equipos
          </Link>

          <Link className="nav-link" to="/partidas">
            Partidas
          </Link>

          <Link className="nav-link" to="/ranking">
            Ranking
          </Link>

        </div>
      </nav>

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

      <footer className="text-center py-3">
        <p>eSports Arena Manager - Desarrollo FullStack II</p>
        <p>Proyecto académico 2026</p>
      </footer>
    </>
  );
}
