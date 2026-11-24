
import { useState } from 'react';

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
    <main className="container-fluid pagina-inicio py-4">

      <section className="mb-4">
        <h2>
          {conectado ? 'Mi cuenta' : 'Bienvenido, visitante'}
        </h2>

        {conectado ? (
          <>
            <p>
              Has iniciado sesión correctamente en
              eSports Arena Manager.
            </p>

            <p>
              <strong>Correo:</strong> {sesion.email}
            </p>

            <p>
              <strong>Rol:</strong> {sesion.rol}
            </p>
          </>
        ) : (
          <p>
            Inicia sesión o regístrate para participar
            en los torneos de eSports Arena Manager.
          </p>
        )}
      </section>

      <section className="mb-4">
        <h2>Bienvenido</h2>

        <p>
          Consulta torneos, equipos, partidas y rankings
          dentro de eSports Arena Manager.
        </p>

        <img
          src="/img/banner-esports.png"
          alt="Banner de eSports Arena Manager"
          className="banner-principal img-fluid"
        />
      </section>

      <section>
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
      </section>

    </main>
  );
}
