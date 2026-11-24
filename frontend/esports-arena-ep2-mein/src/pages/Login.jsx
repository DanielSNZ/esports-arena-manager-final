
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <main className="container-fluid pagina-registro py-5">
      <section className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          <h2>Iniciar sesión</h2>

          <p>
            Ingresa a tu cuenta de eSports Arena Manager.
          </p>

          <form onSubmit={manejarLogin}>

            <div className="mb-3">
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

            <div className="mb-3">
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
              className="btn btn-primary"
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

        </div>
      </section>
    </main>
  );
}
