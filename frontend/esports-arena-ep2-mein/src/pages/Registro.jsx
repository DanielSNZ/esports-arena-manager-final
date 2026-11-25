
import { useState } from 'react';
import { Link } from 'react-router-dom';

const valoresIniciales = {
  nombre: '',
  nickname: '',
  email: '',
  password: '',
  confirmarPassword: ''
};

// Validaciones del formulario
export function validarRegistro(datos) {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = 'Debes ingresar tu nombre.';
  }

  if (!datos.nickname.trim()) {
    errores.nickname = 'Debes ingresar un nickname.';
  }

  if (!datos.email.trim()) {
    errores.email = 'Debes ingresar tu correo.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    errores.email = 'Ingresa un correo válido.';
  }

  if (datos.password.length < 8) {
    errores.password = 'La contraseña debe tener mínimo 8 caracteres.';
  }

  if (datos.password !== datos.confirmarPassword) {
    errores.confirmarPassword = 'Las contraseñas no coinciden.';
  }

  return errores;
}

export default function Registro() {
  const [datos, setDatos] = useState(valoresIniciales);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  const errores = validarRegistro(datos);

  // Actualizar los campos del formulario
  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatos((anteriores) => ({
      ...anteriores,
      [name]: value
    }));

    setMensaje('');
  }

  // Enviar los datos al backend
  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviado(true);
    setMensaje('');

    if (cargando || Object.keys(errores).length > 0) {
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        'http://localhost:8080/api/v1/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: datos.nombre.trim(),
            nickname: datos.nickname.trim(),
            email: datos.email.trim(),
            password: datos.password,
            rol: 'USER',
            estado: 'ACTIVO',
            fechaRegistro: new Date().toISOString().split('T')[0]
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          'No se pudo registrar el usuario. Verifica los datos.'
        );
      }

      setMensaje('¡Cuenta creada correctamente!');
      setTipoMensaje('success');

      setDatos({ ...valoresIniciales });
      setEnviado(false);

    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado.'
      );
      setTipoMensaje('danger');

    } finally {
      setCargando(false);
    }
  }

  const campos = [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ej: Daniel',
      autoComplete: 'name'
    },
    {
      name: 'nickname',
      label: 'Nickname',
      type: 'text',
      placeholder: 'Ej: ShadowPlayer',
      autoComplete: 'username'
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'Ej: jugador@correo.com',
      autoComplete: 'email'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Mínimo 8 caracteres',
      autoComplete: 'new-password'
    },
    {
      name: 'confirmarPassword',
      label: 'Confirmar contraseña',
      type: 'password',
      placeholder: 'Repite tu contraseña',
      autoComplete: 'new-password'
    }
  ];

  return (
    <main className="arena-login-page arena-registro-page">

      <section className="arena-login-container arena-registro-container">

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
              ÚNETE A LA COMUNIDAD
            </span>

            <h1>
              CONVIÉRTETE EN EL
              <span> PRÓXIMO CAMPEÓN.</span>
            </h1>

            <p>
              Crea tu cuenta y comienza tu aventura
              competitiva en eSports Arena Manager.
            </p>

            <div className="arena-login-features">

              <div>
                <span>✓</span>
                Participa en torneos
              </div>

              <div>
                <span>✓</span>
                Forma parte de la comunidad
              </div>

              <div>
                <span>✓</span>
                Compite por el primer lugar
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
              REGISTRO DE JUGADORES
            </span>

            <h2>Crear cuenta</h2>

            <p className="arena-login-description">
              Regístrate para participar en los torneos
              de eSports Arena Manager.
            </p>

            {/* FORMULARIO DE REGISTRO */}

            <form
              className="arena-login-form"
              onSubmit={manejarEnvio}
              noValidate
            >

              {campos.map((campo) => (
                <div
                  className="arena-login-field"
                  key={campo.name}
                >

                  <label
                    htmlFor={campo.name}
                    className="form-label"
                  >
                    {campo.label}:
                  </label>

                  <input
                    id={campo.name}
                    name={campo.name}
                    type={campo.type}
                    placeholder={campo.placeholder}
                    autoComplete={campo.autoComplete}
                    value={datos[campo.name]}
                    onChange={manejarCambio}
                    aria-invalid={
                      enviado && Boolean(errores[campo.name])
                    }
                    aria-describedby={
                      enviado && errores[campo.name]
                        ? `${campo.name}-error`
                        : undefined
                    }
                    className={`form-control ${
                      enviado && errores[campo.name]
                        ? 'is-invalid'
                        : ''
                    }`}
                    disabled={cargando}
                    required
                  />

                  {enviado && errores[campo.name] && (
                    <div
                      id={`${campo.name}-error`}
                      className="invalid-feedback"
                    >
                      {errores[campo.name]}
                    </div>
                  )}

                </div>
              ))}

              <button
                type="submit"
                className="arena-login-button"
                disabled={cargando}
              >
                {cargando ? 'Registrando...' : 'Crear cuenta'}
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

            {/* ENLACE AL LOGIN */}

            <div className="arena-login-register">

              ¿Ya tienes una cuenta?{' '}

              <Link to="/login">
                Inicia sesión
              </Link>

            </div>

            <div className="arena-login-security">
              🔒 Registro de jugadores
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
