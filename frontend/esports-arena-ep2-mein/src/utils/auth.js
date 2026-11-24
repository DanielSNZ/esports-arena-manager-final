
export function obtenerSesion() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];

    const base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const datos = JSON.parse(atob(base64));

    // Comprobar si el token venció
    if (!datos.exp || datos.exp * 1000 <= Date.now()) {
      cerrarSesionLocal();
      return null;
    }

    return {
      token,
      email: datos.sub,
      rol: Array.isArray(datos.roles)
        ? datos.roles[0]
        : null,
      usuarioId: datos.usuarioId,
      nickname: datos.nickname
    };

  } catch {
    cerrarSesionLocal();
    return null;
  }
}

export function cerrarSesionLocal() {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('rol');
  localStorage.removeItem('perfil');
}
