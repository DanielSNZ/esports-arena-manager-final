
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarLogin(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(
        'http://localhost:8080/api/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error('Correo o contraseña incorrectos.');
        }

        throw new Error('No se pudo iniciar sesión.');
      }

      const resultado = await respuesta.json();

      if (!resultado.token) {
        throw new Error('El servidor no entregó un token.');
      }

      // Guardar los datos de la sesión
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('email', resultado.email);
      localStorage.setItem('rol', resultado.rol);

      // Redirigir a Inicio
      navigate('/');

    } catch (error) {
      setError(error.message || 'Error inesperado.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="arena-login-page">

      <section className="arena-login-container">

        {/* PANEL IZQUIERDO */}

        <div className="arena-login-brand">

          <div className="arena-login-brand-content">

            <div className="arena-login-icon">
              🎮
            </div>

            <div className="arena-login-logo">
              ESPORTS<span>ARENA</span>
              <small>MANAGER</small>
            </div>

            <div className="arena-login-line"></div>

            <span className="arena-label">
              BIENVENIDO A LA COMPETICIÓN
            </span>

            <h1>
              TU PRÓXIMA VICTORIA
              <span> COMIENZA AQUÍ.</span>
            </h1>

            <p>
              Compite, forma tu equipo y conquista el ranking.
              Todo comienza en eSports Arena Manager.
            </p>

            <div className="arena-login-features">

              <div>
                <span>✓</span>
                Torneos competitivos
              </div>

              <div>
                <span>✓</span>
                Equipos y comunidad
              </div>

              <div>
                <span>✓</span>
                Clasificación de equipos
              </div>

            </div>

          </div>

          <div className="arena-login-brand-footer">
            ESPORTS ARENA MANAGER
          </div>

        </div>

        {/* PANEL DERECHO */}

        <div className="arena-login-access">

          <div className="arena-login-form-content">

            <span className="arena-label">
              ACCESO A LA PLATAFORMA
            </span>

            <h2>Iniciar sesión</h2>

            <p className="arena-login-description">
              Ingresa a tu cuenta de eSports Arena Manager.
            </p>

            {/* FORMULARIO ORIGINAL */}

            <form
              className="arena-login-form"
              onSubmit={manejarLogin}
            >

              <div className="arena-login-field">

                <label htmlFor="email" className="form-label">
                  Correo electrónico:
                </label>

                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Ej: jugador@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

              </div>

              <div className="arena-login-field">

                <label htmlFor="password" className="form-label">
                  Contraseña:
                </label>

                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

              </div>

              <button
                type="submit"
                className="arena-login-button"
                disabled={cargando}
              >
                {cargando ? 'Ingresando...' : 'Iniciar sesión'}
              </button>

              {error && (
                <div
                  className="alert alert-danger mt-3"
                  role="alert"
                >
                  {error}
                </div>
              )}

            </form>

            {/* ENLACE AL REGISTRO */}

            <div className="arena-login-register">

              ¿No tienes una cuenta?{' '}

              <Link to="/registro">
                Regístrate
              </Link>

            </div>

            <div className="arena-login-security">
              🔒 Acceso a tu cuenta
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
